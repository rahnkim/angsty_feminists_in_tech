#!/usr/bin/env python

import webapp2


class MainHandler(webapp2.RequestHandler):

  def get(self):
    self.response.out.write(open("index.html").read())


class NotFoundPageHandler(webapp2.RequestHandler):

  def get(self):
    self.error(404)
    self.response.out.write(open("404.html").read())


app = webapp2.WSGIApplication(
    [
        ("/", MainHandler), ('/.*', NotFoundPageHandler)
    ],
    debug=True)
