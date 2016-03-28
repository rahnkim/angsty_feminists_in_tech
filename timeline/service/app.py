#!/usr/bin/env python

import base64
import cgi
import json
import urllib

from google.appengine.api import users
from google.appengine.ext import ndb

import webapp2


class Resource(ndb.Model):
  """Models an external resource for bio."""
  title = ndb.StringProperty()
  source = ndb.StringProperty()
  url = ndb.StringProperty()


class BioEvent(ndb.Model):
  """Models a timeline event and associated bio."""
  # Event details
  event = ndb.TextProperty()
  event_year = ndb.IntegerProperty()

  # Bio details
  is_group = ndb.BooleanProperty()
  name = ndb.StringProperty()

  blurb = ndb.TextProperty()
  picture = ndb.BlobProperty()

  birth_year = ndb.IntegerProperty()
  death_year = ndb.IntegerProperty()

  # Extra resources
  resources = ndb.StructuredProperty(Resource, repeated=True)

  @classmethod
  def query_bio_events(cls):
    return cls.query().order(cls.event_year).fetch()


class BioEventHandler(webapp2.RequestHandler):
  def get(self):
    bio_events = BioEvent.query_bio_events()
    for i, bio_event in enumerate(bio_events):
      bio_events[i] = bio_event.to_dict()
    callback = self.request.get("callback")
    self.response.write("{0}({1})".format(callback, json.dumps(bio_events)))

  def post(self):
    try:
      bio_event = BioEvent()
      bio_event.event = self.request.POST.get("event")
      bio_event.event_year = int(self.request.POST.get("event_year"))

      bio_event.is_group = True if self.request.POST.get("is_group") == "true" else False
      bio_event.name = self.request.POST.get("name")
      bio_event.birth_year = int(self.request.POST.get("birth_year"))
      death_year_raw_input = self.request.POST.get("death_year")
      if death_year_raw_input and death_year_raw_input != "undefined":
        bio_event.death_year = int(death_year_raw_input)
      bio_event.blurb = self.request.POST.get("blurb")
      bio_event.picture = base64.b64encode(self.request.POST.get("picture").file.read())

      # TODO. Make resource upload available on single upload page.
      # "Destringify" each resource in resource array.
      bio_event.resources = []
      resources = self.request.POST.getall("resources[]")
      if resources:
        for resource in resources:
          resource_destringified = json.loads(resource)
          resource_entity = Resource()
          resource_entity.title = resource_destringified["title"]
          resource_entity.source = resource_destringified["source"]
          resource_entity.url = resource_destringified["url"]
          bio_event.resources.append(resource_entity)

      bio_event.put()

      self.response.write("Successfully added bio/event for {0}.".format(bio_event.name))
      if not self.request.POST.get("batch"):
        self.redirect('/new-single')
    except Exception as inst:
      self.response.write(inst)

  def delete(self):
    if users.get_current_user() and users.is_current_user_admin():
      db.delete(Entry.all(keys_only=True))


class BioEventSubmissionHandler(webapp2.RequestHandler):
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
			  <h1>Load Single Event/Associated Bio</h1>
			  <div><label>Event*:</label></div>
			  <div>
			    <textarea name="event" rows="6" cols="60"></textarea>
			  </div>
			  <div><label>Event Year*:</label></div>
			  <div>
			    <textarea name="event_year" rows="1" cols="30"></textarea>
			  </div>
			  <div>
			    <label>Is group bio?</label>
			    <input type="radio" name="is_group" value="true">Yes
			    <input type="radio" name="is_group" value="false" checked> No
			  </div>
			  <div><label>Person/Group Name*:</label></div>
			  <div>
			    <textarea name="name" rows="1" cols="60"></textarea>
			  </div>
			  <div><label>Birth/Start Year*:</label></div>
			  <div>
			    <textarea name="birth_year" rows="1" cols="30"></textarea>
			  </div>
			  <div><label>Death/End Year:</label></div>
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
                                  users.create_logout_url('/new-single'))
    else:
      self.response.out.write('<p><a href="%s">Sign in</a>.</p></body></html>' %
                                  users.create_login_url('/new-single'))

class BioEventBatchHandler(webapp2.RequestHandler):
  def get(self):
    user = users.get_current_user()
    if user:
      if users.is_current_user_admin():
        self.response.out.write(open("batch.html").read())
      else:
        self.response.out.write(
            '<html><body><p><a href="%s">Sign out</a>.</p></body></html>' %
                users.create_logout_url('/new-batch'))
    else:
      self.response.out.write(
          '<html><body><p><a href="%s">Sign in</a>.</p></body></html>' %
              users.create_login_url('/new-batch'))


app = webapp2.WSGIApplication(
    [
        ("/", BioEventHandler), ("/new-single", BioEventSubmissionHandler),
        ("/new-batch", BioEventBatchHandler)
    ],
    debug=True)
