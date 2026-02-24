export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  authorRole: string
  date: string
  readTime: string
  image: string
  content: string
  featured?: boolean
}

export const allPosts: BlogPost[] = [
  {
    id: 1,
    slug: "ra-mat-dong-san-pham-pig-feed-premium-2024",
    title: "Ra mắt dòng sản phẩm Pig Feed Premium 2024",
    excerpt: "APPE JV tự hào giới thiệu dòng sản phẩm Pig Feed Premium với công thức dinh dưỡng cải tiến, giúp tăng trưởng nhanh và hiệu quả chi phí cao hơn 15%.",
    category: "Sản phẩm mới",
    author: "APPE JV",
    authorRole: "Marketing Team",
    date: "2024-02-20",
    readTime: "5 phút đọc",
    image: "/blog/pig-feed-premium.jpg",
    featured: true,
    content: `
      <p>APPE JV tự hào công bố ra mắt dòng sản phẩm Pig Feed Premium 2024 - một bước tiến quan trọng trong việc nâng cao chất lượng dinh dưỡng cho ngành chăn nuôi heo tại Việt Nam.</p>

      <h2>Công thức dinh dưỡng cải tiến</h2>
      <p>Sau 2 năm nghiên cứu và phát triển, đội ngũ chuyên gia của APPE JV đã tạo ra công thức dinh dưỡng hoàn toàn mới, tối ưu hóa tỷ lệ protein, năng lượng và vi chất để đáp ứng nhu cầu phát triển của heo ở từng giai đoạn.</p>

      <h3>Điểm nổi bật của Pig Feed Premium 2024:</h3>
      <ul>
        <li><strong>Tăng trưởng nhanh hơn 15%</strong>: Công thức mới giúp heo tăng trọng nhanh hơn so với sản phẩm thông thường</li>
        <li><strong>Tiết kiệm chi phí</strong>: Hệ số chuyển đổi thức ăn (FCR) được cải thiện đáng kể</li>
        <li><strong>Tăng cường miễn dịch</strong>: Bổ sung các chất tăng cường hệ miễn dịch tự nhiên</li>
        <li><strong>An toàn tuyệt đối</strong>: Không chứa chất cấm, đạt chuẩn xuất khẩu</li>
      </ul>

      <h2>Ứng dụng công nghệ tiên tiến</h2>
      <p>Pig Feed Premium 2024 được sản xuất trên dây chuyền công nghệ hiện đại từ Châu Âu, đảm bảo chất lượng đồng đều và ổn định. Quy trình sản xuất tuân thủ nghiêm ngặt các tiêu chuẩn ISO 9001:2015, HACCP và GMP.</p>

      <h2>Phản hồi từ khách hàng</h2>
      <p>Trong giai đoạn thử nghiệm, hơn 50 trang trại đã sử dụng sản phẩm và đạt kết quả vượt mong đợi. Anh Nguyễn Văn A, chủ trang trại tại Hà Nam chia sẻ: "Sau 3 tháng sử dụng Pig Feed Premium, đàn heo của tôi tăng trọng nhanh hơn rõ rệt và ít bệnh tật hơn."</p>

      <h2>Cam kết của APPE JV</h2>
      <p>Chúng tôi cam kết đồng hành cùng người chăn nuôi với chính sách hỗ trợ kỹ thuật 24/7, tư vấn miễn phí và chương trình ưu đãi dành cho khách hàng thân thiết.</p>

      <p>Để biết thêm thông tin chi tiết về Pig Feed Premium 2024, vui lòng liên hệ hotline <strong>0351 359 520</strong> hoặc truy cập website của chúng tôi.</p>
    `
  },
  {
    id: 2,
    slug: "5-bi-quyet-chan-nuoi-heo-hieu-qua",
    title: "5 bí quyết chăn nuôi heo hiệu quả trong mùa nắng nóng",
    excerpt: "Chia sẻ kinh nghiệm và giải pháp giúp người chăn nuôi duy trì năng suất cao trong điều kiện thời tiết khắc nghiệt.",
    category: "Hướng dẫn",
    author: "Nguyễn Văn A",
    authorRole: "Chuyên gia chăn nuôi",
    date: "2024-02-15",
    readTime: "7 phút đọc",
    image: "/blog/pig-farming-tips.jpg",
    content: `
      <p>Mùa nắng nóng là thời điểm khó khăn nhất đối với người chăn nuôi heo. Nhiệt độ cao không chỉ ảnh hưởng đến sức khỏe mà còn làm giảm năng suất tăng trọng. Dưới đây là 5 bí quyết giúp bạn duy trì hiệu quả chăn nuôi.</p>

      <h2>1. Đảm bảo hệ thống làm mát</h2>
      <p>Hệ thống làm mát là yếu tố quan trọng nhất. Bạn có thể áp dụng các biện pháp:</p>
      <ul>
        <li>Lắp đặt quạt thông gió, hệ thống phun sương</li>
        <li>Trồng cây xanh xung quanh chuồng trại</li>
        <li>Sử dụng mái che cách nhiệt</li>
        <li>Tạo bể nước để heo tắm mát</li>
      </ul>

      <h2>2. Điều chỉnh chế độ dinh dưỡng</h2>
      <p>Trong mùa nắng nóng, heo thường ăn ít hơn. Do đó cần:</p>
      <ul>
        <li>Tăng hàm lượng năng lượng trong khẩu phần</li>
        <li>Bổ sung vitamin C, E để tăng cường sức đề kháng</li>
        <li>Cho ăn vào sáng sớm và chiều mát</li>
        <li>Đảm bảo nước uống sạch, mát</li>
      </ul>

      <h2>3. Quản lý mật độ chuồng trại</h2>
      <p>Giảm mật độ nuôi giúp heo có không gian thoải mái hơn, giảm stress do nhiệt. Nên giảm 20-30% mật độ so với mùa mát.</p>

      <h2>4. Vệ sinh và phòng bệnh</h2>
      <p>Thời tiết nóng ẩm là điều kiện thuận lợi cho vi khuẩn phát triển:</p>
      <ul>
        <li>Vệ sinh chuồng trại 2 lần/ngày</li>
        <li>Khử trùng định kỳ</li>
        <li>Theo dõi sức khỏe đàn heo hàng ngày</li>
        <li>Tiêm phòng đầy đủ</li>
      </ul>

      <h2>5. Theo dõi và điều chỉnh linh hoạt</h2>
      <p>Mỗi trang trại có điều kiện khác nhau, cần theo dõi và điều chỉnh phù hợp. Ghi chép đầy đủ để rút kinh nghiệm cho các mùa sau.</p>

      <p>Áp dụng 5 bí quyết trên, bạn có thể duy trì năng suất chăn nuôi ổn định ngay cả trong mùa nắng nóng khắc nghiệt nhất.</p>
    `
  },
  {
    id: 3,
    slug: "xu-huong-chan-nuoi-ben-vung-2024",
    title: "Xu hướng chăn nuôi bền vững 2024",
    excerpt: "Phân tích các xu hướng mới trong ngành chăn nuôi: công nghệ, môi trường và hiệu quả kinh tế.",
    category: "Xu hướng ngành",
    author: "Trần Thị B",
    authorRole: "Chuyên gia ngành",
    date: "2024-02-10",
    readTime: "6 phút đọc",
    image: "/blog/sustainable-farming.jpg",
    content: `
      <p>Năm 2024 đánh dấu sự chuyển mình mạnh mẽ của ngành chăn nuôi Việt Nam hướng tới phát triển bền vững. Dưới đây là những xu hướng nổi bật.</p>

      <h2>1. Ứng dụng công nghệ số</h2>
      <p>Công nghệ 4.0 đang thay đổi cách thức chăn nuôi truyền thống:</p>
      <ul>
        <li><strong>IoT và cảm biến thông minh</strong>: Theo dõi nhiệt độ, độ ẩm, chất lượng không khí tự động</li>
        <li><strong>AI và Big Data</strong>: Phân tích dữ liệu để tối ưu hóa khẩu phần ăn</li>
        <li><strong>Blockchain</strong>: Truy xuất nguồn gốc sản phẩm</li>
        <li><strong>Ứng dụng quản lý</strong>: Số hóa quy trình chăn nuôi</li>
      </ul>

      <h2>2. Chăn nuôi thân thiện môi trường</h2>
      <p>Áp lực về môi trường đòi hỏi các giải pháp xanh:</p>
      <ul>
        <li>Xử lý chất thải bằng công nghệ sinh học</li>
        <li>Sử dụng năng lượng tái tạo</li>
        <li>Giảm phát thải khí nhà kính</li>
        <li>Tái chế nước và phân bón hữu cơ</li>
      </ul>

      <h2>3. Chăn nuôi hữu cơ và an toàn sinh học</h2>
      <p>Người tiêu dùng ngày càng quan tâm đến sản phẩm sạch, an toàn. Xu hướng chăn nuôi hữu cơ, không sử dụng kháng sinh đang phát triển mạnh.</p>

      <h2>4. Tích hợp chuỗi giá trị</h2>
      <p>Liên kết từ sản xuất thức ăn, chăn nuôi đến chế biến và phân phối giúp tăng giá trị và đảm bảo chất lượng.</p>

      <h2>5. Đào tạo và nâng cao năng lực</h2>
      <p>Đầu tư vào con người là chìa khóa thành công. Các chương trình đào tạo, tập huấn kỹ thuật ngày càng được chú trọng.</p>

      <h2>Kết luận</h2>
      <p>Chăn nuôi bền vững không chỉ là xu hướng mà là yêu cầu bắt buộc. Những trang trại đầu tư đúng hướng sẽ có lợi thế cạnh tranh lớn trong tương lai.</p>
    `
  }
]
