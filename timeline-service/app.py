#!/usr/bin/env python

import base64
import json
import urllib

from google.appengine.ext import ndb

import webapp2


class Bio(ndb.Model):
  """Models an individual bio with name, life in years, and bio blurb."""
  name = ndb.StringProperty()

  blurb = ndb.TextProperty()
  picture = ndb.BlobProperty()

  birth_year = ndb.IntegerProperty()
  death_year = ndb.IntegerProperty()

  @classmethod
  def query_bios(cls):
    return cls.query().order(cls.birth_year).fetch()


class BioHandler(webapp2.RequestHandler):
  def get(self):
    bios = Bio.query_bios()
    for i, bio in enumerate(bios):
      bios[i] = bio.to_dict()
      bios[i]["picture"] = base64.b64encode(bio.picture)
    self.response.write(json.dumps(bios))

  def post(self):
    bio = Bio()
    bio.name = self.request.get("name")
    bio.birth_year = int(self.request.get("birth_year"))
    death_year_raw_input = self.request.get("death_year")
    if death_year_raw_input:
      bio.death_year = int(death_year_raw_input)
    bio.blurb = self.request.get("blurb")
    bio.picture = self.request.get("picture")
    bio.put()
    self.redirect('/form')


class BioSubmissionHandler(webapp2.RequestHandler):
  def get(self):
    self.response.out.write('<html><body>')
    self.response.out.write('<h1>New bio entry</h1>')
    self.response.out.write("""
		  <form action="/bio"
				enctype="multipart/form-data"
				method="post">
			<div><label>Name:</label></div>
			<div>
			  <textarea name="name" rows="1" cols="60"></textarea>
			</div>
			<div><label>Birth Year:</label></div>
			<div>
			  <textarea name="birth_year" rows="1" cols="30"></textarea>
			</div>
			<div><label>Death Year:</label></div>
			<div>
			  <textarea name="death_year" rows="1" cols="30"></textarea>
			</div>
			<div><label>Blurb:</label></div>
			<div>
			  <textarea name="blurb" rows="6" cols="60"></textarea>
			</div>
			<div><label>Picture:</label></div>
			<div><input type="file" name="picture"/></div>
			<div><input type="submit" value="Upload new bio"></div>
		  </form>
		</body>
	  </html>""")


class MainHandler(webapp2.RequestHandler):
  def get(self):
    self.response.out.write("Nothing here.")


app = webapp2.WSGIApplication(
    [
        ("/", MainHandler), ("/form", BioSubmissionHandler),
        ("/bio", BioHandler)
    ],
    debug=True)
