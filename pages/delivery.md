---
title: Vegan Food Delivery in Prestwich
metaTitle: Vegan Food Delivery in Prestwich
permalink: /food-delivery-takeaways/
layout: page.html
eleventyNavigation:
  key: Delivery
  order: 4
---

The below restaurants all deliver vegan food - click the names for more info.

<ul class="items-list">
{%- for item in collections.products -%}
  {%- if item.data.delivery -%}
  <li class="list-item">
    <a href="{{ item.url }}">
      <h3>{{ item.data.title }}</h3>
    </a>
    {%- if item.data.omni %}<span class="badge">Also serves non-vegan</span>{%- endif -%}
  </li>
  {%- endif -%}
{%- endfor -%}
</ul>
