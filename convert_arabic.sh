#!/bin/bash

# Convert all remaining Arabic error messages
find app/api -name "*.ts" -type f | while read file; do
  # Dropship errors
  sed -i 's/"المورد غير موجود"/"Supplier not found"/g' "$file"
  
  # Admin dashboard
  sed -i "s/قناة \${String.fromCharCode(1571 + (i % 26))} - Channel/Channel/g" "$file"
done

# Convert remaining in file content
sed -i 's/أنت محلل جودة الصور للمتجر الإلكتروني\./#You are an image quality analyzer for the online store./g' app/api/image-quality/route.ts
sed -i 's/قيّم جودة هذه الصورة للمنتج على النقاط التالية:/Evaluate the quality of this product image on the following points:/g' app/api/image-quality/route.ts
sed -i 's/الإضاءة (مناسبة، متساوية، بدون ظلال قاسية)/Lighting (suitable, even, without harsh shadows)/g' app/api/image-quality/route.ts
sed -i 's/الدقة (وضوح عالي، بدون ضبابية)/Resolution (high clarity, no blur)/g' app/api/image-quality/route.ts
sed -i 's/الخلفية (بسيطة وخالية من التشتيت)/Background (simple and distraction-free)/g' app/api/image-quality/route.ts
sed -i 's/وضوح المنتج (المنتج محطة بوضوح وكاملاً في الصورة)/Product clarity (product is clear and complete in the image)/g' app/api/image-quality/route.ts
sed -i 's/الألوان (دقيقة وطبيعية)/Colors (accurate and natural)/g' app/api/image-quality/route.ts

echo "Conversion complete"
