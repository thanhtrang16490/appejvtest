#!/bin/bash

# Complete script to translate all homepage content

FILE=$1
LANG=$2

if [ "$LANG" = "en" ]; then
  echo "🔄 Translating $FILE to English..."
  
  # Hero section
  sed -i '' 's/Thương hiệu uy tín 16+ năm/Trusted Brand 16+ Years/g' "$FILE"
  sed -i '' 's/Tăng <span class="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">30%<\/span> Hiệu Quả<br \/>Chăn Nuôi Của Bạn/Increase Your <span class="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">30%<\/span> Farming<br \/>Efficiency/g' "$FILE"
  sed -i '' 's/Với Thức Ăn Công Nghệ Cao Từ APPE JV/With High-Tech Feed from APPE JV/g' "$FILE"
  sed -i '' 's/Tăng trọng nhanh hơn/Faster weight gain/g' "$FILE"
  sed -i '' 's/Giảm chi phí thức ăn/Reduced feed costs/g' "$FILE"
  sed -i '' 's/Vật nuôi khỏe mạnh/Healthier livestock/g' "$FILE"
  sed -i '' 's/Xem sản phẩm & giá ngay/View Products \& Prices/g' "$FILE"
  sed -i '' 's/Tư vấn miễn phí 24\/7/Free Consultation 24\/7/g' "$FILE"
  sed -i '' 's/Chứng nhận quốc tế/International Certification/g' "$FILE"
  sed -i '' 's/Kinh nghiệm/Years Experience/g' "$FILE"
  sed -i '' 's/>Khách hàng</>Customers</g' "$FILE"
  sed -i '' 's/Xuất khẩu/Export/g' "$FILE"
  sed -i '' 's/Đông Nam Á & Châu Âu/Southeast Asia \& Europe/g' "$FILE"
  sed -i '' 's/Khám phá thêm/Discover More/g' "$FILE"
  
  # Stats
  sed -i '' 's/Năm thành lập/Year Established/g' "$FILE"
  sed -i '' 's/Khách hàng tin dùng/Trusted Customers/g' "$FILE"
  sed -i '' 's/Tấn sản phẩm\/năm/Tons Production\/Year/g' "$FILE"
  sed -i '' 's/% Khách hàng hài lòng/% Customer Satisfaction/g' "$FILE"
  
  # Vision & Mission
  sed -i '' 's/>Tầm nhìn</>Vision</g' "$FILE"
  sed -i '' 's/>Sứ mệnh</>Mission</g' "$FILE"
  sed -i '' 's/Trở thành doanh nghiệp uy tín trong lĩnh vực sản xuất thức ăn chăn nuôi và thủy sản tại Việt Nam và khu vực/To become a reputable enterprise in the field of livestock and aquaculture feed production in Vietnam and the region/g' "$FILE"
  sed -i '' 's/Cung cấp sản phẩm chất lượng cao, ổn định, ứng dụng công nghệ tiên tiến và đồng hành cùng khách hàng phát triển bền vững/Provide high-quality, stable products, apply advanced technology and accompany customers for sustainable development/g' "$FILE"
  
  # Video section
  sed -i '' 's/Khám phá APPE JV/Discover APPE JV/g' "$FILE"
  sed -i '' 's/Hành trình và cam kết của chúng tôi trong việc/Our journey and commitment to/g' "$FILE"
  sed -i '' 's/cung cấp thức ăn chăn nuôi chất lượng cao/providing high-quality livestock feed/g' "$FILE"
  
  # Ecosystem
  sed -i '' 's/Hệ sinh thái A Group/A Group Ecosystem/g' "$FILE"
  sed -i '' 's/APPE là thành viên của hệ sinh thái A Group - tập đoàn hàng đầu/APPE is a member of the A Group ecosystem - a leading corporation/g' "$FILE"
  sed -i '' 's/trong lĩnh vực nông nghiệp, chăn nuôi và thực phẩm tại Việt Nam/in agriculture, livestock and food in Vietnam/g' "$FILE"
  sed -i '' 's/Cùng nhau xây dựng chuỗi giá trị nông nghiệp bền vững từ trang trại đến bàn ăn/Together building a sustainable agricultural value chain from farm to fork/g' "$FILE"
  sed -i '' 's/Tập đoàn hàng đầu trong lĩnh vực nông nghiệp và thực phẩm/Leading corporation in agriculture and food/g' "$FILE"
  sed -i '' 's/Thức ăn chăn nuôi chất lượng cao/High-quality livestock feed/g' "$FILE"
  sed -i '' 's/Trang trại chăn nuôi công nghệ cao/High-tech livestock farm/g' "$FILE"
  sed -i '' 's/Chế biến thực phẩm an toàn/Safe food processing/g' "$FILE"
  sed -i '' 's/Chuỗi nhà hàng 5 sao/5-star restaurant chain/g' "$FILE"
  sed -i '' 's/Dược thú y và sinh học/Veterinary medicine and biology/g' "$FILE"
  sed -i '' 's/Vaccine và sinh phẩm/Vaccines and biologicals/g' "$FILE"
  
  # Features
  sed -i '' 's/Tại sao chọn APPE?/Why Choose APPE?/g' "$FILE"
  sed -i '' 's/Chúng tôi mang đến giải pháp toàn diện cho ngành chăn nuôi với công nghệ hiện đại/We bring comprehensive solutions to the livestock industry with modern technology/g' "$FILE"
  sed -i '' 's/>Chất lượng cao</>High Quality</g' "$FILE"
  sed -i '' 's/Sản phẩm đạt tiêu chuẩn quốc tế, đảm bảo an toàn và hiệu quả/Products meet international standards, ensuring safety and effectiveness/g' "$FILE"
  sed -i '' 's/>Công nghệ tiên tiến</>Advanced Technology</g' "$FILE"
  sed -i '' 's/Ứng dụng công nghệ và tiêu chuẩn sản xuất hiện đại/Application of modern technology and production standards/g' "$FILE"
  sed -i '' 's/>Đồng hành bền vững</>Sustainable Partnership</g' "$FILE"
  sed -i '' 's/Cam kết phát triển bền vững cùng khách hàng và đối tác/Commitment to sustainable development with customers and partners/g' "$FILE"
  sed -i '' 's/>Xuất khẩu quốc tế</>International Export</g' "$FILE"
  sed -i '' 's/Sản phẩm được xuất khẩu sang Đông Nam Á và Châu Âu/Products exported to Southeast Asia and Europe/g' "$FILE"
  
  # Products
  sed -i '' 's/Danh mục sản phẩm/Product Categories/g' "$FILE"
  sed -i '' 's/Dòng sản phẩm thức ăn chăn nuôi và thủy sản chất lượng cao,/High-quality livestock and aquaculture feed products,/g' "$FILE"
  sed -i '' 's/đảm bảo dinh dưỡng tối ưu cho từng giai đoạn phát triển/ensuring optimal nutrition for each development stage/g' "$FILE"
  sed -i '' 's/Thức ăn cho heo/Pig Feed/g' "$FILE"
  sed -i '' 's/THỨC ĂN HEO CAO CẤP/PREMIUM PIG FEED/g' "$FILE"
  sed -i '' 's/Công thức dinh dưỡng tối ưu cho từng giai đoạn phát triển, hỗ trợ tăng trưởng và sức đề kháng tối đa/Optimal nutritional formula for each development stage, supporting maximum growth and resistance/g' "$FILE"
  sed -i '' 's/Protein 18-20% từ nguồn chất lượng cao/18-20% protein from high-quality sources/g' "$FILE"
  sed -i '' 's/Vitamin và khoáng chất cân bằng/Balanced vitamins and minerals/g' "$FILE"
  sed -i '' 's/Hỗ trợ tiêu hóa và tăng trọng nhanh/Supports digestion and rapid weight gain/g' "$FILE"
  sed -i '' 's/An toàn tuyệt đối, không chất cấm/Absolutely safe, no banned substances/g' "$FILE"
  
  sed -i '' 's/Thức ăn cho gia cầm/Poultry Feed/g' "$FILE"
  sed -i '' 's/THỨC ĂN GIA CẦM CHUYÊN NGHIỆP/PROFESSIONAL POULTRY FEED/g' "$FILE"
  sed -i '' 's/Dinh dưỡng cân bằng cho gà, vịt, giúp vật nuôi khỏe mạnh và phát triển đồng đều, năng suất cao/Balanced nutrition for chickens and ducks, helping livestock stay healthy and develop uniformly with high productivity/g' "$FILE"
  sed -i '' 's/Năng lượng tối ưu cho từng giai đoạn/Optimal energy for each stage/g' "$FILE"
  sed -i '' 's/Tăng cường sức đề kháng tự nhiên/Enhance natural resistance/g' "$FILE"
  sed -i '' 's/Cải thiện chất lượng trứng và thịt/Improve egg and meat quality/g' "$FILE"
  sed -i '' 's/Giảm tỷ lệ chết, tăng hiệu quả kinh tế/Reduce mortality, increase economic efficiency/g' "$FILE"
  
  sed -i '' 's/Thức ăn cho thủy sản/Aquaculture Feed/g' "$FILE"
  sed -i '' 's/THỨC ĂN THỦY SẢN XUẤT KHẨU/EXPORT AQUACULTURE FEED/g' "$FILE"
  sed -i '' 's/Đáp ứng nhu cầu nuôi trồng thủy sản trong nước và xuất khẩu sang Đông Nam Á, Châu Âu với tiêu chuẩn quốc tế/Meeting domestic aquaculture needs and exports to Southeast Asia, Europe with international standards/g' "$FILE"
  sed -i '' 's/Công thức đặc biệt cho từng loại cá/Special formula for each fish species/g' "$FILE"
  sed -i '' 's/Tỷ lệ chuyển đổi thức ăn (FCR) tối ưu/Optimal feed conversion ratio (FCR)/g' "$FILE"
  sed -i '' 's/Không gây ô nhiễm môi trường nước/Does not pollute water environment/g' "$FILE"
  sed -i '' 's/Xuất khẩu sang Đông Nam Á và Châu Âu/Exported to Southeast Asia and Europe/g' "$FILE"
  
  echo "✅ Translated $FILE to English"
  
elif [ "$LANG" = "cn" ]; then
  echo "🔄 Translating $FILE to Chinese..."
  
  # Hero section
  sed -i '' 's/Thương hiệu uy tín 16+ năm/信誉品牌16+年/g' "$FILE"
  sed -i '' 's/Tăng <span class="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">30%<\/span> Hiệu Quả<br \/>Chăn Nuôi Của Bạn/提高您的<span class="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">30%<\/span><br \/>养殖效率/g' "$FILE"
  sed -i '' 's/Với Thức Ăn Công Nghệ Cao Từ APPE JV/使用APPE JV的高科技饲料/g' "$FILE"
  sed -i '' 's/Tăng trọng nhanh hơn/更快增重/g' "$FILE"
  sed -i '' 's/Giảm chi phí thức ăn/降低饲料成本/g' "$FILE"
  sed -i '' 's/Vật nuôi khỏe mạnh/更健康的牲畜/g' "$FILE"
  sed -i '' 's/Xem sản phẩm & giá ngay/查看产品和价格/g' "$FILE"
  sed -i '' 's/Tư vấn miễn phí 24\/7/24\/7免费咨询/g' "$FILE"
  sed -i '' 's/Chứng nhận quốc tế/国际认证/g' "$FILE"
  sed -i '' 's/Kinh nghiệm/年经验/g' "$FILE"
  sed -i '' 's/>Khách hàng</>客户</g' "$FILE"
  sed -i '' 's/Xuất khẩu/出口/g' "$FILE"
  sed -i '' 's/Đông Nam Á & Châu Âu/东南亚和欧洲/g' "$FILE"
  sed -i '' 's/Khám phá thêm/了解更多/g' "$FILE"
  
  # Stats
  sed -i '' 's/Năm thành lập/成立年份/g' "$FILE"
  sed -i '' 's/Khách hàng tin dùng/信赖客户/g' "$FILE"
  sed -i '' 's/Tấn sản phẩm\/năm/吨产量\/年/g' "$FILE"
  sed -i '' 's/% Khách hàng hài lòng/% 客户满意度/g' "$FILE"
  
  # Vision & Mission
  sed -i '' 's/>Tầm nhìn</>愿景</g' "$FILE"
  sed -i '' 's/>Sứ mệnh</>使命</g' "$FILE"
  sed -i '' 's/Trở thành doanh nghiệp uy tín trong lĩnh vực sản xuất thức ăn chăn nuôi và thủy sản tại Việt Nam và khu vực/成为越南和地区畜牧和水产饲料生产领域的信誉企业/g' "$FILE"
  sed -i '' 's/Cung cấp sản phẩm chất lượng cao, ổn định, ứng dụng công nghệ tiên tiến và đồng hành cùng khách hàng phát triển bền vững/提供高质量、稳定的产品，应用先进技术，与客户共同可持续发展/g' "$FILE"
  
  # Video section
  sed -i '' 's/Khám phá APPE JV/探索APPE JV/g' "$FILE"
  sed -i '' 's/Hành trình và cam kết của chúng tôi trong việc/我们提供高质量畜牧饲料的/g' "$FILE"
  sed -i '' 's/cung cấp thức ăn chăn nuôi chất lượng cao/旅程和承诺/g' "$FILE"
  
  # Ecosystem
  sed -i '' 's/Hệ sinh thái A Group/A Group生态系统/g' "$FILE"
  sed -i '' 's/APPE là thành viên của hệ sinh thái A Group - tập đoàn hàng đầu/APPE是A Group生态系统的成员 - 越南农业、/g' "$FILE"
  sed -i '' 's/trong lĩnh vực nông nghiệp, chăn nuôi và thực phẩm tại Việt Nam/畜牧和食品领域的领先集团/g' "$FILE"
  sed -i '' 's/Cùng nhau xây dựng chuỗi giá trị nông nghiệp bền vững từ trang trại đến bàn ăn/共同建设从农场到餐桌的可持续农业价值链/g' "$FILE"
  sed -i '' 's/Tập đoàn hàng đầu trong lĩnh vực nông nghiệp và thực phẩm/农业和食品领域的领先集团/g' "$FILE"
  sed -i '' 's/Thức ăn chăn nuôi chất lượng cao/高质量畜牧饲料/g' "$FILE"
  sed -i '' 's/Trang trại chăn nuôi công nghệ cao/高科技畜牧农场/g' "$FILE"
  sed -i '' 's/Chế biến thực phẩm an toàn/安全食品加工/g' "$FILE"
  sed -i '' 's/Chuỗi nhà hàng 5 sao/五星级餐厅连锁/g' "$FILE"
  sed -i '' 's/Dược thú y và sinh học/兽医药和生物学/g' "$FILE"
  sed -i '' 's/Vaccine và sinh phẩm/疫苗和生物制品/g' "$FILE"
  
  # Features
  sed -i '' 's/Tại sao chọn APPE?/为什么选择APPE？/g' "$FILE"
  sed -i '' 's/Chúng tôi mang đến giải pháp toàn diện cho ngành chăn nuôi với công nghệ hiện đại/我们为畜牧业提供现代技术的综合解决方案/g' "$FILE"
  sed -i '' 's/>Chất lượng cao</>高质量</g' "$FILE"
  sed -i '' 's/Sản phẩm đạt tiêu chuẩn quốc tế, đảm bảo an toàn và hiệu quả/产品符合国际标准，确保安全和有效/g' "$FILE"
  sed -i '' 's/>Công nghệ tiên tiến</>先进技术</g' "$FILE"
  sed -i '' 's/Ứng dụng công nghệ và tiêu chuẩn sản xuất hiện đại/应用现代技术和生产标准/g' "$FILE"
  sed -i '' 's/>Đồng hành bền vững</>可持续合作</g' "$FILE"
  sed -i '' 's/Cam kết phát triển bền vững cùng khách hàng và đối tác/承诺与客户和合作伙伴可持续发展/g' "$FILE"
  sed -i '' 's/>Xuất khẩu quốc tế</>国际出口</g' "$FILE"
  sed -i '' 's/Sản phẩm được xuất khẩu sang Đông Nam Á và Châu Âu/产品出口到东南亚和欧洲/g' "$FILE"
  
  # Products
  sed -i '' 's/Danh mục sản phẩm/产品类别/g' "$FILE"
  sed -i '' 's/Dòng sản phẩm thức ăn chăn nuôi và thủy sản chất lượng cao,/高质量的畜牧和水产饲料产品，/g' "$FILE"
  sed -i '' 's/đảm bảo dinh dưỡng tối ưu cho từng giai đoạn phát triển/确保每个发展阶段的最佳营养/g' "$FILE"
  sed -i '' 's/Thức ăn cho heo/猪饲料/g' "$FILE"
  sed -i '' 's/THỨC ĂN HEO CAO CẤP/高级猪饲料/g' "$FILE"
  sed -i '' 's/Công thức dinh dưỡng tối ưu cho từng giai đoạn phát triển, hỗ trợ tăng trưởng và sức đề kháng tối đa/每个发展阶段的最佳营养配方，支持最大生长和抵抗力/g' "$FILE"
  sed -i '' 's/Protein 18-20% từ nguồn chất lượng cao/来自高质量来源的18-20%蛋白质/g' "$FILE"
  sed -i '' 's/Vitamin và khoáng chất cân bằng/平衡的维生素和矿物质/g' "$FILE"
  sed -i '' 's/Hỗ trợ tiêu hóa và tăng trọng nhanh/支持消化和快速增重/g' "$FILE"
  sed -i '' 's/An toàn tuyệt đối, không chất cấm/绝对安全，无禁用物质/g' "$FILE"
  
  sed -i '' 's/Thức ăn cho gia cầm/家禽饲料/g' "$FILE"
  sed -i '' 's/THỨC ĂN GIA CẦM CHUYÊN NGHIỆP/专业家禽饲料/g' "$FILE"
  sed -i '' 's/Dinh dưỡng cân bằng cho gà, vịt, giúp vật nuôi khỏe mạnh và phát triển đồng đều, năng suất cao/鸡鸭的平衡营养，帮助牲畜保持健康，均匀发展，高生产力/g' "$FILE"
  sed -i '' 's/Năng lượng tối ưu cho từng giai đoạn/每个阶段的最佳能量/g' "$FILE"
  sed -i '' 's/Tăng cường sức đề kháng tự nhiên/增强自然抵抗力/g' "$FILE"
  sed -i '' 's/Cải thiện chất lượng trứng và thịt/改善蛋和肉的质量/g' "$FILE"
  sed -i '' 's/Giảm tỷ lệ chết, tăng hiệu quả kinh tế/降低死亡率，提高经济效益/g' "$FILE"
  
  sed -i '' 's/Thức ăn cho thủy sản/水产饲料/g' "$FILE"
  sed -i '' 's/THỨC ĂN THỦY SẢN XUẤT KHẨU/出口水产饲料/g' "$FILE"
  sed -i '' 's/Đáp ứng nhu cầu nuôi trồng thủy sản trong nước và xuất khẩu sang Đông Nam Á, Châu Âu với tiêu chuẩn quốc tế/满足国内水产养殖需求和出口到东南亚、欧洲的国际标准/g' "$FILE"
  sed -i '' 's/Công thức đặc biệt cho từng loại cá/每种鱼类的特殊配方/g' "$FILE"
  sed -i '' 's/Tỷ lệ chuyển đổi thức ăn (FCR) tối ưu/最佳饲料转化率(FCR)/g' "$FILE"
  sed -i '' 's/Không gây ô nhiễm môi trường nước/不污染水环境/g' "$FILE"
  sed -i '' 's/Xuất khẩu sang Đông Nam Á và Châu Âu/出口到东南亚和欧洲/g' "$FILE"
  
  echo "✅ Translated $FILE to Chinese"
fi
