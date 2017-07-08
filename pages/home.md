@title Home
@keywords mdwebsite,site,generator,markdown,server,web

@section hero image dark-content text-shadow dark-background background-image-city

@subsection dark-background extra-top-padding extra-bottom-padding

# mdwebsite

## deploy landing pages faster

### much faster

@subsection three columns dark-background

- ### Fast

  Deploy anywhere with a single command.
  Ready to go in a minute.
  Runs on the mighty node.js platform.

- ### Simple
  
  Your website relies on easily editable text (markdown) pages.
  You edit and deploy new content in minutes. 

- ### Universal

  Convenient extensions to markdown helps to build beautiful websites.
  This page is, actually, also a markdown page.

@section 

@subsection 

## How it works

**mdwebsite** helps to deploy small websites, landing pages and web services in a minute. 
It is built to look great right out of the box.

## How to install

    npm install mdwebsite
    
## How to use

Default home page is `home.md`.
Add .md files to the `pages` folder, links to `pages/nav.md` and footer content to `pages/footer.md`.

Every page can pass custom properties to handlebars template engine, define them as @propertyName *property value*.

#### Page example:

@section code
    <meta name="description" content="{{description}}">
    <meta name="keywords" content="{{keywords}}">

    @title Page title for the <title> tag
    @description Description for <meta name="description"> tag
    @keywords Keywords for <meta name="keywords"> tag
    @customProperty Define custom properties — this one is acessible in views as {{customProperty}}

    # Header
    
    Page content - markdown text.
    
    <div class="...">Tags are also available</div>
    
@section default

## Sections and subsections

**mdwebsite** exends markdown syntax with several additional commands that enable advanced formatting.

### @section
----
**`@section`** keyword defines a section - a part of page that may contain text, image, code blok (like the one above).
It can be followed by one or more css class names. Possible values for section types are:

- `hero` — a section that attracts attention like the one on the top of the page;
- `image` — a section with image background;
- `fixed-image` — a section with fixed image background;
- `code` — a piece of code or any formatted text;
- `default` — default section.

Possible modifiers:

- `dark-content` — makes text white for dark backgrounds;
- `light-content` — makes text black for bright backgrounds;
- `extra-top-padding` — adds space above section content;
- `extra-bottom-padding` — adds space below section content;
- `text-shadow` — adds shadow to text in section;


### @subsection
----
**@subsection** defines a layout for current section. Each section may consist of multiple subsections.

- `default` — default text layout, on bigger screens text column is limited to a certain width;
- `full` — text layout without the limit;
- `columns` — set of columns, can be `two columns`, `three columns` or `four columns`;
  markdown list element (-) turns into column.

Possible modifiers:

- `dark-background` — adds a 50%-transparent black background;
- `text-shadow` — adds shadow to text in subsection;
- `secondary` — makes text smaller;
- `text-align-left`, `text-align-center` and `text-align-right` control text alignment;
- `text-strong` — makes text bold.

### @space
----
**@space** is a simple &lt;div> block that can be used with modifiers `height-xx`, `min-height-xx` and `max-height-xx`.

### Height modifiers
----
Heigth modifiers — css classes that are calculated whenever page resizes:

- height-*xx*
- min-height-*xx*
- max-height-*xx*

where *xx* can be 10, 20, 30, 40, 50, 60, 70, 80, 90 and 100 % of page's height.

### Folder structure
----
**mdwebsite** consists of five folders:

| | |
| --- | --- |
|`core` | mdwebsite core files|
|`api` | custom API calls|
|`pages` | contains pages — .md files|
|`static` | javascript, css, images, etc.|
|`views` | templates and partials for pages|

### Maintenance mode
----
Whenever you need to put your website into maintenance mode, 
add `pages/maintenance.md` file — any request will return this file instead of a requested page.
