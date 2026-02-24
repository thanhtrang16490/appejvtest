#!/bin/bash

# Script to translate homepage text from Vietnamese to English/Chinese

FILE=$1
LANG=$2

if [ "$LANG" = "en" ]; then
  # English translations
  sed -i '' 's/Thương hiệu uy tín 16+ năm • ISO 9001:2015/Trusted Brand 16+ Years • ISO 9001:2015/g' "$FILE"
  sed -i '' 's/Tăng <span class="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">30%<\/span> Hiệu Quả<br \/>Chăn Nuôi Của Bạn/Increase Your <span class="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">30%<\/span> Farming<br \/>Efficiency/g' "$FILE"
  sed -i '' 's/Với Thức Ăn Công Nghệ Cao Từ APPE JV/With High-Tech Feed from APPE JV/g' "$FILE"
  sed -i '' 's/Tăng trọng nhanh hơn/Faster weight gain/g' "$FILE"
  sed -i '' 's/Giảm chi phí thức ăn/Reduced feed costs/g' "$FILE"
  sed -i '' 's/Vật nuôi khỏe mạnh/Healthier livestock/g' "$FILE"
  sed -i '' 's/Xem sản phẩm & giá ngay/View Products & Prices/g' "$FILE"
  sed -i '' 's/Tư vấn miễn phí 24\/7/Free Consultation 24\/7/g' "$FILE"
  sed -i '' 's/Chứng nhận quốc tế/International Certification/g' "$FILE"
  sed -i '' 's/Kinh nghiệm/Years Experience/g' "$FILE"
  sed -i '' 's/Khách hàng/Customers/g' "$FILE"
  sed -i '' 's/Xuất khẩu/Export/g' "$FILE"
  sed -i '' 's/Đông Nam Á & Châu Âu/Southeast Asia & Europe/g' "$FILE"
  sed -i '' 's/Khám phá thêm/Discover More/g' "$FILE"
  sed -i '' 's/Năm thành lập/Year Established/g' "$FILE"
  sed -i '' 's/Khách hàng tin dùng/Trusted Customers/g' "$FILE"
  sed -i '' 's/Tấn sản phẩm\/năm/Tons Production\/Year/g' "$FILE"
  sed -i '' 's/% Khách hàng hài lòng/% Customer Satisfaction/g' "$FILE"
  sed -i '' 's/Tầm nhìn/Vision/g' "$FILE"
  sed -i '' 's/Sứ mệnh/Mission/g' "$FILE"
  sed -i '' 's/Trở thành doanh nghiệp uy tín trong lĩnh vực sản xuất thức ăn chăn nuôi và thủy sản tại Việt Nam và khu vực/To become a reputable enterprise in the field of livestock and aquaculture feed production in Vietnam and the region/g' "$FILE"
  sed -i '' 's/Cung cấp sản phẩm chất lượng cao, ổn định, ứng dụng công nghệ tiên tiến và đồng hành cùng khách hàng phát triển bền vững/Provide high-quality, stable products, apply advanced technology and accompany customers for sustainable development/g' "$FILE"
  sed -i '' 's/Khám phá APPE JV/Discover APPE JV/g' "$FILE"
  sed -i '' 's/Hành trình và cam kết của chúng tôi trong việc<br class="hidden md:block" \/>\n        cung cấp thức ăn chăn nuôi chất lượng cao/Our journey and commitment to<br class="hidden md:block" \/>\n        providing high-quality livestock feed/g' "$FILE"
  sed -i '' 's/Hệ sinh thái A Group/A Group Ecosystem/g' "$FILE"
  sed -i '' 's/APPE là thành viên của hệ sinh thái A Group - tập đoàn hàng đầu<br class="hidden md:block" \/>\n          trong lĩnh vực nông nghiệp, chăn nuôi và thực phẩm tại Việt Nam/APPE is a member of the A Group ecosystem - a leading corporation<br class="hidden md:block" \/>\n          in agriculture, livestock and food in Vietnam/g' "$FILE"
  sed -i '' 's/Cùng nhau xây dựng chuỗi giá trị nông nghiệp bền vững từ trang trại đến bàn ăn/Together building a sustainable agricultural value chain from farm to fork/g' "$FILE"
  sed -i '' 's/Tại sao chọn APPE?/Why Choose APPE?/g' "$FILE"
  sed -i '' 's/Chúng tôi mang đến giải pháp toàn diện cho ngành chăn nuôi với công nghệ hiện đại/We bring comprehensive solutions to the livestock industry with modern technology/g' "$FILE"
  sed -i '' 's/Danh mục sản phẩm/Product Categories/g' "$FILE"
  sed -i '' 's/Dòng sản phẩm thức ăn chăn nuôi và thủy sản chất lượng cao,<br class="hidden md:block" \/>\n          đảm bảo dinh dưỡng tối ưu cho từng giai đoạn phát triển/High-quality livestock and aquaculture feed products,<br class="hidden md:block" \/>\n          ensuring optimal nutrition for each development stage/g' "$FILE"
  
  echo "✅ Translated $FILE to English"
  
elif [ "$LANG" = "cn" ]; then
  # Chinese translations
  sed -i '' 's/Thương hiệu uy tín 16+ năm • ISO 9001:2015/信誉品牌16+年 • ISO 9001:2015/g' "$FILE"
  sed -i '' 's/Tăng <span class="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">30%<\/span> Hiệu Quả<br \/>Chăn Nuôi Của Bạn/提高您的<span class="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">30%<\/span><br \/>养殖效率/g' "$FILE"
  sed -i '' 's/Với Thức Ăn Công Nghệ Cao Từ APPE JV/使用APPE JV的高科技饲料/g' "$FILE"
  sed -i '' 's/Tăng trọng nhanh hơn/更快增重/g' "$FILE"
  sed -i '' 's/Giảm chi phí thức ăn/降低饲料成本/g' "$FILE"
  sed -i '' 's/Vật nuôi khỏe mạnh/更健康的牲畜/g' "$FILE"
  sed -i '' 's/Xem sản phẩm & giá ngay/查看产品和价格/g' "$FILE"
  sed -i '' 's/Tư vấn miễn phí 24\/7/24\/7免费咨询/g' "$FILE"
  sed -i '' 's/Chứng nhận quốc tế/国际认证/g' "$FILE"
  sed -i '' 's/Kinh nghiệm/年经验/g' "$FILE"
  sed -i '' 's/Khách hàng/客户/g' "$FILE"
  sed -i '' 's/Xuất khẩu/出口/g' "$FILE"
  sed -i '' 's/Đông Nam Á & Châu Âu/东南亚和欧洲/g' "$FILE"
  sed -i '' 's/Khám phá thêm/了解更多/g' "$FILE"
  sed -i '' 's/Năm thành lập/成立年份/g' "$FILE"
  sed -i '' 's/Khách hàng tin dùng/信赖客户/g' "$FILE"
  sed -i '' 's/Tấn sản phẩm\/năm/吨产量\/年/g' "$FILE"
  sed -i '' 's/% Khách hàng hài lòng/% 客户满意度/g' "$FILE"
  sed -i '' 's/Tầm nhìn/愿景/g' "$FILE"
  sed -i '' 's/Sứ mệnh/使命/g' "$FILE"
  sed -i '' 's/Trở thành doanh nghiệp uy tín trong lĩnh vực sản xuất thức ăn chăn nuôi và thủy sản tại Việt Nam và khu vực/成为越南和地区畜牧和水产饲料生产领域的信誉企业/g' "$FILE"
  sed -i '' 's/Cung cấp sản phẩm chất lượng cao, ổn định, ứng dụng công nghệ tiên tiến và đồng hành cùng khách hàng phát triển bền vững/提供高质量、稳定的产品，应用先进技术，与客户共同可持续发展/g' "$FILE"
  sed -i '' 's/Khám phá APPE JV/探索APPE JV/g' "$FILE"
  sed -i '' 's/Hành trình và cam kết của chúng tôi trong việc<br class="hidden md:block" \/>\n        cung cấp thức ăn chăn nuôi chất lượng cao/我们提供高质量畜牧饲料的<br class="hidden md:block" \/>\n        旅程和承诺/g' "$FILE"
  sed -i '' 's/Hệ sinh thái A Group/A Group生态系统/g' "$FILE"
  sed -i '' 's/APPE là thành viên của hệ sinh thái A Group - tập đoàn hàng đầu<br class="hidden md:block" \/>\n          trong lĩnh vực nông nghiệp, chăn nuôi và thực phẩm tại Việt Nam/APPE是A Group生态系统的成员 - 越南农业、<br class="hidden md:block" \/>\n          畜牧和食品领域的领先集团/g' "$FILE"
  sed -i '' 's/Cùng nhau xây dựng chuỗi giá trị nông nghiệp bền vững từ trang trại đến bàn ăn/共同建设从农场到餐桌的可持续农业价值链/g' "$FILE"
  sed -i '' 's/Tại sao chọn APPE?/为什么选择APPE？/g' "$FILE"
  sed -i '' 's/Chúng tôi mang đến giải pháp toàn diện cho ngành chăn nuôi với công nghệ hiện đại/我们为畜牧业提供现代技术的综合解决方案/g' "$FILE"
  sed -i '' 's/Danh mục sản phẩm/产品类别/g' "$FILE"
  sed -i '' 's/Dòng sản phẩm thức ăn chăn nuôi và thủy sản chất lượng cao,<br class="hidden md:block" \/>\n          đảm bảo dinh dưỡng tối ưu cho từng giai đoạn phát triển/高质量的畜牧和水产饲料产品，<br class="hidden md:block" \/>\n          确保每个发展阶段的最佳营养/g' "$FILE"
  
  echo "✅ Translated $FILE to Chinese"
fi
