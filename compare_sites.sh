#!/bin/bash

echo "=== Site Comparison Report ==="
echo

echo "1. Page counts:"
echo "   Live site: $(find tmp_site -name "*.html" -o -name "vegan-business-advice" | wc -l) pages"
echo "   Local site: $(find _site -name "*.html" | wc -l) pages"
echo

echo "2. Missing pages in local build:"
comm -23 <(find tmp_site -name "*.html" -o -name "vegan-business-advice" | sed 's|tmp_site/veganprestwich.co.uk/||' | sort) \
         <(find _site -name "*.html" | sed 's|_site/||' | sort) | head -10

echo
echo "3. Campo Blanco review differences:"
echo "   Live site has $(grep -c '<p>' tmp_site/veganprestwich.co.uk/place/campo-blanco/index.html) <p> tags"
echo "   Local site has $(grep -c '<p>' _site/place/campo-blanco/index.html) <p> tags"
echo
echo "   Live site December 2022 review structure:"
grep -A2 "December 2022" tmp_site/veganprestwich.co.uk/place/campo-blanco/index.html | wc -l
echo "   lines for December 2022 review section"
echo
echo "   Local site December 2022 review structure:"
grep -A2 "December 2022" _site/place/campo-blanco/index.html | wc -l
echo "   lines for December 2022 review section"

echo
echo "4. Review structure comparison for All The Shapes:"
echo "   Live site:"
grep -c "href=.*instagram\|href=.*facebook" tmp_site/veganprestwich.co.uk/place/all-the-shapes/index.html
echo "   review links found"
echo "   Local site:"
grep -c "href=.*instagram\|href=.*facebook" _site/place/all-the-shapes/index.html
echo "   review links found"