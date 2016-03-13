#!/usr/bin/env python

import base64
import cgi
import json
import urllib

from google.appengine.api import users
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
    callback = self.request.get("callback")
    self.response.write("{0}({1})".format(callback, json.dumps(bios)))

  def post(self):
    try:
      bio = Bio()
      bio.name = self.request.POST.get("name")
      bio.birth_year = int(self.request.POST.get("birth_year"))
      death_year_raw_input = self.request.POST.get("death_year")
      if death_year_raw_input and death_year_raw_input != "undefined":
        bio.death_year = int(death_year_raw_input)
      bio.blurb = self.request.POST.get("blurb")
      print self.request.POST.get("picture")
      bio.picture = base64.b64encode(self.request.POST.get("picture").file.read())
      # Use json.loads to "destringify" each resource in resource array.
      bio.put()
      self.response.write("Successfully added bio for {0}.".format(bio.name))
      if not self.request.POST.get("batch"):
        self.redirect('/new')
    except Exception as inst:
      self.response.write(inst)

  def delete(self):
    db.delete(Entry.all(keys_only=True))


class BioSubmissionHandler(webapp2.RequestHandler):
  def get(self):
    self.response.out.write('<html><body>')
    user = users.get_current_user()
    if user:
      if users.is_current_user_admin():
        self.response.out.write("""
		  <form action="/"
				enctype="multipart/form-data"
				method="post">
			<fieldset>
			  <h1>Load Single Bio</h1>
			  <div><label>Name*:</label></div>
			  <div>
			    <textarea name="name" rows="1" cols="60"></textarea>
			  </div>
			  <div><label>Birth Year*:</label></div>
			  <div>
			    <textarea name="birth_year" rows="1" cols="30"></textarea>
			  </div>
			  <div><label>Death Year:</label></div>
			  <div>
			    <textarea name="death_year" rows="1" cols="30"></textarea>
			  </div>
			  <div><label>Blurb*:</label></div>
			  <div>
			    <textarea name="blurb" rows="6" cols="60"></textarea>
			  </div>
			  <div><label>Picture*:</label></div>
			  <div><input type="file" name="picture"/></div>
			  <div style="margin-top: 15px">
			    <input type="submit" value="UPLOAD!">
			  </div>
			</fieldset>
		  </form>""")
      self.response.out.write('<p><a href="%s">Sign out</a>.</p></body></html>' %
                                  users.create_logout_url('/new'))
    else:
      self.response.out.write('<p><a href="%s">Sign in</a>.</p></body></html>' %
                                  users.create_login_url('/new'))

class BioBatchHandler(webapp2.RequestHandler):
  def get(self):
    user = users.get_current_user()
    if user:
      if users.is_current_user_admin():
        self.response.out.write(open("batch.html").read())
      else:
        self.response.out.write(
            '<html><body><p><a href="%s">Sign out</a>.</p></body></html>' %
                users.create_logout_url('/new'))
    else:
      self.response.out.write(
          '<html><body><p><a href="%s">Sign in</a>.</p></body></html>' %
              users.create_login_url('/new'))


app = webapp2.WSGIApplication(
    [
        ("/", BioHandler), ("/new", BioSubmissionHandler),
        ("/newbatch", BioBatchHandler)
    ],
    debug=True)
