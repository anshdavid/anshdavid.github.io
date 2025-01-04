---
layout: default
---

<br />
Each passing week, I take my pen in hand,\
To capture thoughts that in my mind do grow.\
On topics vast as sea or grains of sand,\
I weave my words, their essence to bestow.

What truths I've found, what wonders I have seen,\
Are shaped and crafted, bound in written lore.\
Through fleeting hours, where thought and heart convene,\
I pen my musings, seeking ever more.

Oh, reader, here assembled is the hoard,\
A trove of lines to stir both heart and head.\
These humble works, to thee I now afford,\
My labors laid where curious souls are led.

So take these words, and journey where they lead,\
A garden grown from every planted seed.\
<br />

<ul class="recent-list">
    {% assign post_list = '' | split: ',' %}
    {% for post in site.posts %}
    {% for tag in post.tags %}
    {% assign post_list = post_list | push: post %}
    {% endfor %}
    {% endfor %}
    {% for post in post_list %}
    {% unless post == previous %}
    <li>
        <span class="article-date">{{ post.date | date: "%b %d, %Y" }}: </span>
        <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endunless %}
    {% assign previous = post %}
    {% endfor %}
</ul>

<!-- <small>
    {% for tag in site.tags %}
    {% assign tag_slug = tag | first %}
    {% assign no_of_posts = tag | last | size %}
    <a href="{{ 'tagged/' | relative_url }}{{ tag_slug }}" title="See all posts by {{ tag_slug }} tag">#{{
        tag_slug
        }}</a>
    {% endfor %}
</small> -->