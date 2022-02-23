#!/usr/sbin/bash

sed -i "s/&#x60;/\`/g" content/posts/*.md
sed -i "s/&#x27;/\'/g" content/posts/*.md
sed -i "s/&#x22;/\"/g" content/posts/*.md
sed -i "s/&#x3D;/=/g" content/posts/*.md
sed -i "s/&#x26;/\&/g" content/posts/*.md
sed -i "s/&#x2F;/\//g" content/posts/*.md
sed -i "s/&#x3E;/>/g" content/posts/*.md
sed -i "s/&#x3C;/</g" content/posts/*.md
sed -i "s/&#x3A;/:/g" content/posts/*.md
sed -i "s/&#39;/\'/g" content/posts/*.md
sed -i "s/&quot;/\"/g" content/posts/*.md
sed -i "s/&lt;/</g" content/posts/*.md
sed -i "s/&gt;/>/g" content/posts/*.md
sed -i "s/](images/](\/images/g" content/posts/*.md