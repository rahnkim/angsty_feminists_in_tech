# The Angsty Feminists in Tech Project (TAFITI)

<p>Live site is at http://www.angstyfeministsintech.org</p>
<p>The Angsty Feminists in Tech Initiative (TAFITI) is a web project made for intersectional feminists by intersectional feminists. Be an intersectional feminist. :) <3</p>

## Overall Project Code Structure

So far, the project consists of three parts:
* Main landing site @ `main/` - not yet live
* Timeline site @ `timeline/app/`
* Timeline data service @ `timeline/service/`

Each runs on a separate [Google App Engine](https://cloud.google.com/appengine/) instance.

### General Start Guide

1. [Download the Google App Engine SDK](https://cloud.google.com/appengine/downloads) for Python development.
2. Set up/locally run a new application/project for each application (the root folders of which can be individually identified by the existence of app.yaml file).
3. Develop/debug on a branch.
4. Create pull request and merge (if authorised).
5. Deploy to live site (if authorised).

## Subproject: The Timeline
The timeline presents an intersectional view of the underdogs that have contributed to
computer science.<br>
