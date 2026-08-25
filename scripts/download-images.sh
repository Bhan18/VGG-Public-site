#!/bin/bash
# Download all images used by the VGG Infra public website
# Saves to /home/z/my-project/download/website-images/

set -e
BASE="/home/z/my-project/download/website-images"

echo "📥 Downloading hero banner images..."
curl -sL "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80" -o "$BASE/hero/hero-1-farmland-sunset.jpg"
curl -sL "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80" -o "$BASE/hero/hero-2-forest-trees.jpg"
curl -sL "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=1920&q=80" -o "$BASE/hero/hero-3-mango-orchard.jpg"

echo "📥 Downloading project cover images..."
curl -sL "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80" -o "$BASE/projects/project-1-sandalwood.jpg"
curl -sL "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=1200&q=80" -o "$BASE/projects/project-2-mango.jpg"
curl -sL "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80" -o "$BASE/projects/project-3-green-valley.jpg"

echo "📥 Downloading gallery images..."
curl -sL "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80" -o "$BASE/gallery/gallery-1-entrance.jpg"
curl -sL "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80" -o "$BASE/gallery/gallery-2-roads.jpg"
curl -sL "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80" -o "$BASE/gallery/gallery-3-saplings.jpg"
curl -sL "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=800&q=80" -o "$BASE/gallery/gallery-4-sunset.jpg"
curl -sL "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80" -o "$BASE/gallery/gallery-5-water.jpg"
curl -sL "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80" -o "$BASE/gallery/gallery-6-farmhouse.jpg"
curl -sL "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=800&q=80" -o "$BASE/gallery/gallery-7-avenue.jpg"
curl -sL "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&q=80" -o "$BASE/gallery/gallery-8-harvest.jpg"
curl -sL "https://images.unsplash.com/photo-1444065381814-865dc9da92c0?w=800&q=80" -o "$BASE/gallery/gallery-9-panorama.jpg"

echo "📥 Downloading team photos..."
curl -sL "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" -o "$BASE/team/team-1-venkatesh.jpg"
curl -sL "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80" -o "$BASE/team/team-2-gayathri.jpg"
curl -sL "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" -o "$BASE/team/team-3-arjun.jpg"
curl -sL "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" -o "$BASE/team/team-4-meena.jpg"

echo "📥 Downloading testimonial photos..."
curl -sL "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" -o "$BASE/testimonials/test-1-rajesh.jpg"
curl -sL "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" -o "$BASE/testimonials/test-2-lakshmi.jpg"
curl -sL "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" -o "$BASE/testimonials/test-3-mohammed.jpg"
curl -sL "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" -o "$BASE/testimonials/test-4-priya.jpg"

echo "📥 Downloading offer images..."
curl -sL "https://images.unsplash.com/photo-1438449805896-28a666819a20?w=800&q=80" -o "$BASE/offers/offer-1-monsoon.jpg"
curl -sL "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80" -o "$BASE/offers/offer-2-refer.jpg"
curl -sL "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" -o "$BASE/offers/offer-3-nri.jpg"

echo "📥 Downloading news images..."
curl -sL "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80" -o "$BASE/news/news-1-green-valley.jpg"
curl -sL "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80" -o "$BASE/news/news-2-phase2.jpg"
curl -sL "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80" -o "$BASE/news/news-3-hdfc.jpg"

echo "📥 Downloading video thumbnails..."
curl -sL "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80" -o "$BASE/videos/video-1-sandalwood.jpg"
curl -sL "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=800&q=80" -o "$BASE/videos/video-2-mango.jpg"

echo ""
echo "✅ All images downloaded to: $BASE"
echo ""
echo "📁 Directory structure:"
find "$BASE" -type f | sort | sed "s|$BASE/|  |"
echo ""
echo "📊 Total size:"
du -sh "$BASE"
