# Table of Contents
  1. [Markup](#markup)
  1. [Creating simpletope](#creating-simpletope)
  1. [Filters](#filters)
    1. [Creating a filter](#creating-a-filter)
    1. [Reset filters](#reset-filters)
    1. [Single or multiple filters](#single-or-multiple-filters)
    1. [Advanced filtering](#advanced-filtering)
  1. [Sorting](#sorting)
    1. [Creating a sorter](#creating-a-sorter)
    1. [Sorting selector](#sorting-selector)
    1. [Sorting direction](#sorting-direction)
  1. [Multiple isotope instances](#multiple-isotope-instances)
    1. [Target a single Isotope instance](#target-a-single-isotope-instance)
  1. [Layout modes](#layout-modes)
  1. [Feedback](#feedback)
  1. [Clear filters](#clear-filters)
  1. [Hash support](#hash-support)
  1. [imagesLoaded](#imagesloaded)

## Markup
All the data used for filter and sorting are kept in the markup. It could be a text value, like a title or tag. Or it could be a number, like a price, measurement, or rating.

For our example, each item element has several data points that can be used for sorting. There’s the elemental symbol, number, name of the element, weight, and category.

    <div id="container" data-isotope>
        <div class="item transition metal" data-category="transition">
            <p class="number">79</p>
            <h3 class="symbol">Au</h3>
            <h2 class="name">Gold</h2>
            <p class="weight">196.966569</p>
        </div>
        <div class="item metalloid" data-category="metalloid">
            <p class="number">51</p>
            <h3 class="symbol">Sb</h3>
            <h2 class="name">Antimony</h2>
            <p class="weight">121.76</p>
        </div>
        ...
    </div>

## Creating simpletope
In order to trigger simpletope you need to specify `data-isotope` without a value on the container of your items.

    <div id="container" data-isotope>
        ...
    </div>

## Filters
### Creating a filter
You can specify filters by using the `data-filter` attribute on an element. The value of this attribute should be a valid CSS selector of the element you want to filter.

#### Filter on class:
    <button data-filter=".metal">Metal</button>

#### Filter on attribute value:
    <button data-filter="[data-category='transition']">Transition</button>

### Reset filters
To reset all filters you can specify the value `*` in the `data-filter` attribute:

    <button data-filter="*" class="btn btn-default">All</button>

### Single or multiple filters
By default the filters will only apply one filter. if you would like to have multiple filters applied then you can use `data-filter-type` attribute on the container of your items. The value of this attribute can be `multiple` or `single`.

    <div id="container" data-isotope data-filter-type="multiple">
        ...
    </div>

### Advanced filtering
When using multiple filters then by default the filters will apply the filter(s) with the `or` statement, this means `blue` or `red` will be filtered, if you would like to filter on `blue` and `red` then you can specify the `data-filter-method` on the container of your items.

    <div id="container" data-isotope data-filter-method="and">
        ...
    </div>


## Sorting
### Creating a sorter
You can specify sorting by using the `data-sort-by` attribute on an element. By default this script will look for a class based on this name.

With the [Markup](#markup) above, we can set data-sort-by to `name`, `symbol`, `number`, `weight`, and `category`.

    <button data-sort-by="category">Category</button>

##### Two additional `data-sort-by` options are built in:

  - `original-order` will use the original order of the item elements to arrange them in the layout.
  - `random` is a random order.

### Sorting selector
By default `data-sort-by` will look at the contents of the specified name as class.

If you want to sort on attributes then you can specify `data-sort-selector`, this should be a valid CSS selector.

    <button data-sort-by="category" data-sort-selector="[data-category]">Category</button>

### Sorting direction
If you want to control the ascending or descending options then you can use `data-sort-direction` attribute with `asc` or `desc` as value.

    <button data-sort-by="category" data-sort-selector="[data-category]" data-sort-direction="asc">Categories ascending</button>
    <button data-sort-by="category" data-sort-selector="[data-category]" data-sort-direction="desc">Categories descending</button>

## Multiple Isotope instances
### Target a single Isotope instance
By default the filters will be applied to all Isotope instances created a page, if you want to target a single isotope then you can apply `data-isotope-container` on a common container that holds your filters, the value should be a valid HTML id that holds your items (see [Markup](#markup) for the items):

    <div id="filterButtonsByClass" data-isotope-container="container">
        <label>Filter by color:</label>
        <div class="btn-group">
            <button data-filter=".blue" class="btn btn-default">Blue</button>
            <button data-filter=".black" class="btn btn-default">Black</button>
            <button data-filter=".brown" class="btn btn-default">Brown</button>
        </div>
    </div>


## Layout modes
You can specify the layout mode by adding `data-layout` to the container of your items. This can be any valid isotope layout modes, by default we use `fitRows`. Keep in mind that you need to include the javascript file of the layout mode you want to use. (in this example you need to download and include masonry)

    <div id="container" data-isotope data-layout="masonry">
        ...
    </div>

## Feedback
You can specify a feedback line with the current numbers of items shown, you can use `data-feedback` with the attribute value as the text you want. You can use the placeholder `{delta}` to get the total items in a number.

    <div class="feedback">
        <div data-feedback="Showing {delta} items" data-isotope-container="results"></div>
    </div>

The above example would generate: `Showing 9 items`

## Clear filters
You can clear all applied filters with `data-clear-filter`, the element will be hidden until a filter has been applied.

    <div data-clear-filter class="close"><i class="fa fa-close"></i> Clear filters</div>

## Hash support
You can enable hash support by adding `data-hash` to the container of your items. The hash will automatically update the URL with `http://path/#category=transition`

    <div id="container" data-isotope data-hash>

## imagesLoaded
[imagesLoaded](http://imagesloaded.desandro.com/) is supported, just include the script `imagesloaded.js` after loading `isotope.js`. 
