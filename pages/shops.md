---
title: Shops Selling Vegan Food
metaTitle: Vegan Food in Prestwich's Shops
permalink: /shops/
layout: page.html
eleventyNavigation:
  key: Shops
  order: 3
---

Shops selling vegan-friendly food, booze, and household goods.

<ul class="items-list">
{%- for item in collections.products -%}
  {%- if item.data.shop -%}
  <li class="list-item">
    <a href="{{ item.url }}">
      <h3>{{ item.data.title }}</h3>
    </a>
    {%- if item.data.omni %}<span class="badge">Also serves non-vegan</span>{%- endif -%}
  </li>
  {%- endif -%}
{%- endfor -%}
</ul>
