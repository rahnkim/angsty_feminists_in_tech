#!/usr/bin/env python

import json
import urllib
import urllib2
import webapp2


class BioHandler(webapp2.RequestHandler):

  def get(self):
    self.response.write("This will eventually serve the collection of bios.")


class ImageHandler(webapp2.RequestHandler):

  def get(self, img_id):
    self.response.write("This will eventually serve image associated with ID '"
                        + img_id + "'.")


class MainHandler(webapp2.RequestHandler):

  def get(self):
    self.response.out.write("Nothing here.")


app = webapp2.WSGIApplication(
    [
        ("/", MainHandler), ("/image/(.*)", ImageHandler),
        ("/bio", BioHandler)
    ],
    debug=True)
