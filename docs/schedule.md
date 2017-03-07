# new schedule

To replicate existing CMS using new stuff

## basic domain model

Current domain model is a bit like:

* Sites
* Pages
* Prefabs
* Forms
* Files
* Users

The UI is basically a 'library' view that shows icons for each of these, then
will you drill in you see a list of existing with ability to edit existing or
create a new one

### sites

Multi tenanted system, the cms runs all the sites

#### site model

```javascript
{
  name: 'site name',
  urls: [
    'http://primary.example.com',
    'http://secondary.example.com',
    'http://etc.example.com'
  ],
  customClaims: [
    'a list of',
    'custom claims',
    'just for the site'
  ],
  stylesheets: [
    'a list of.css',
    'uploaded css files.css'
  ]
}
```

### pages

A page is both some metadata about itself needed to integrate it into the site,
and a pointer to a document for the actual HTML etc

#### page model

```javascript
{
  name: 'Getting Started',
  slug: 'getting-started',
  navigationOrder: 1,
  excludeFromNavigation: false,
  parentPage: 'Home',
  stylesheets: [
    'same as sites.css'
  ],
  tags: [
    'to help find and',
    'organise pages',
    'when there are many'
  ]
}
```

### prefabs

A prefab is a specialist document fragment etc

#### prefab model

It just has a name, a link to the document and some tags, no need to get too
specific

### forms

Just another composer but with form fields - replaced with the schema composer?

At the moment only supports contact forms (well, forms that get emailed to an
address), so it has a simple model:

#### form model

```javascript
{
  name: 'Name of this form',
  email: 'send.to.this.address@example.net',
  useRecaptcha: true,
  successMessage: 'Your message was sent',
  submitText: 'Send',
  tags: [
    'etc'
  ]
}
```

### files

Manages uploads, makes them available to other things

#### file model

It's just tags and a file man. But really, we keep things like the path, the
original name, the mimetype - here's one from a db dump (looks like test data
man)

```json
{
  "key": "file",
  "originalname": "Kitten 3.jpg",
  "mimetype": "image/jpeg",
  "filename": "zip-415c87fb423747f9cd645a3c13fcfbdc-Kitten 3.jpg",
  "path": "uploads\\zip-415c87fb423747f9cd645a3c13fcfbdc-Kitten 3.jpg",
  "size": 39130,
  "tags": [
    "cats a"
  ],
  "_id": "file-08143954eb2803b82bebfe7cd1e9243b",
  "width": 1024,
  "height": 768,
  "_created": "2016-03-10T01:03:56.336Z",
  "_updated": "2016-03-10T01:03:56.336Z"
}
```

## views

What views make these up?

* **rendered pages**
* **cms home**

  A grid of available library screens

* **library screen**

  Shows a list of items, you can add a new one or edit an existing one

* **composer**

  For manipulating trees - the existing project just has a `component composer`

* **new item screen**

  A form for filling out the fields required for a new item

* **existing item screen**

  A form for editing an existing item

* **file library**

  Mostly like a library screen but specialized for files

## things we definitely need

### quick

* more components
  - app-bar (specialised class of header-bar)
  - grid, for libraries

    modify row component to not wrap, grid is same as row but wraps
* routing
  - first decision is what website
  - route nodes - what are the nodeTypes we needs for these?
* image resizing
  - immediately, not on demand, perhaps via a work queue - if the queue hasn't
    completed, serve the image at original size
* uploads (1-2 hours)
* emailing
* zipping / unzipping

### moderate

* normalize schema
* schema -> form

* users
* claims - might be easy, might just be a matter of filtering nodes
* model composer / schema composer / html composer / component composer

  We have all the bits, but they need to be exposed to the UI, wired to storage
  etc.
* backup / restore
* tags / filtering / searching
* user css - how does it work under new system?
* saving/publishing/versioning
  - every page is static and cached, even those with dynamic parts
  - pages with dynamic parts update via js

### slow





