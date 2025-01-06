---
layout: default
---

<br />
In the passing of each week, as time weaves its endless tale, \
I take up my quill to inscribe the knowledge I have gathered upon my journey through this vast and wondrous realm. 

With careful thought, I pen the musings of my heart and the reflections of my mind,\
on matters that stir the soul and spark the flame of curiosity within. 
 
It is a labor of love, akin to the crafting of a tale told around the fires of old.\
Here now is a collection, a record of all the blogs I have written, a treasure trove of words for those who seek it.
<br />
<br />

<ul class="medium-article-list">
    {% for item in site.data.articles.medium %}
    <li>
        <a href="{{ item.permalink | strip}}">{{ item.title }}</a>
    </li>
    {% endfor %}
</ul>