---
title: Restaurants
metaTitle: Vegan Food in Prestwich's Restaurants
permalink: /restaurants/
layout: page.html
eleventyNavigation:
  key: Restaurants
  order: 2
---

Places you can sit down for tasty vegan food in Prestwich - click the business names for more info.

<ul class="items-list">
{%- for item in collections.products -%}
  {%- if item.data.restaurant -%}
  <li class="list-item">
    <a href="{{ item.url }}">
      <h3>{{ item.data.title }}</h3>
    </a>
    {%- if item.data.omni %}<span class="badge">Also serves non-vegan</span>{%- endif -%}
  </li>
  {%- endif -%}
{%- endfor -%}
</ul>
