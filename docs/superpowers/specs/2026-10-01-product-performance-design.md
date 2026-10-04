# Thiết kế bài tập tối ưu hiệu năng ReactJS

## Mục tiêu

Xây dựng một ứng dụng ReactJS quản lý 3.000 sản phẩm để minh họa rõ sự khác biệt giữa phiên bản chưa tối ưu và đã tối ưu. Bài làm phải đơn giản, dễ đọc, dễ trình bày trong môi trường học tập và có kết quả Lighthouse được đo thật trên cùng một máy.

## Phạm vi

- Dùng ReactJS, TypeScript và Vite.
- Dữ liệu gồm đúng 3.000 sản phẩm được tạo cố định ở phía trình duyệt; không dùng backend.
- Mỗi sản phẩm có mã, tên, danh mục, giá, số lượng tồn kho và trạng thái.
- Có hai địa chỉ độc lập trong cùng ứng dụng:
  - `/before`: phiên bản chưa tối ưu.
  - `/after`: phiên bản đã tối ưu.
- Hai phiên bản có cùng giao diện, dữ liệu và chức năng để việc so sánh công bằng.
- Chức năng gồm tìm kiếm theo tên, lọc theo danh mục, xem các thẻ thống kê và danh sách sản phẩm.
- Không thêm đăng nhập, phân quyền, CRUD với máy chủ hoặc cơ sở dữ liệu.

## Kiến trúc và thành phần

Ứng dụng dùng router nhẹ dựa trên đường dẫn hiện tại để lựa chọn trang cần tải. Phần tạo dữ liệu và logic lọc là mã dùng chung, trong khi hai trang `BeforePage` và `AfterPage` thể hiện hai cách render khác nhau.

- `product-data`: tạo tập 3.000 sản phẩm có kết quả ổn định qua các lần chạy.
- `product-filter`: tìm kiếm và lọc sản phẩm bằng các hàm thuần, dễ kiểm thử.
- `BeforePage`: render toàn bộ hàng sản phẩm cùng lúc và tính lại dữ liệu/thống kê trong mỗi lần render.
- `AfterPage`: chỉ render các hàng đang xuất hiện trong vùng cuộn, ghi nhớ kết quả tính toán và tách tải phần chi tiết nặng.
- `ProductToolbar`: ô tìm kiếm, bộ lọc danh mục và thông tin số kết quả.
- `ProductTable`: bảng đầy đủ dùng cho bản trước tối ưu.
- `VirtualProductTable`: danh sách ảo hóa dùng cho bản sau tối ưu.
- `ProductDetails`: hộp chi tiết được tải động để minh họa code-splitting.

## Luồng dữ liệu

Khi trang mở, ứng dụng tạo cùng một danh sách 3.000 sản phẩm. Từ khóa và danh mục do người dùng chọn được chuyển vào logic lọc. Kết quả lọc tạo ra các thẻ thống kê và danh sách hiển thị. Mọi dữ liệu ở phía trình duyệt nên bài làm vẫn chạy sau khi build mà không phụ thuộc dịch vụ bên ngoài.

## Kỹ thuật tối ưu

### Virtualization

Phiên bản `/before` tạo DOM cho tất cả hàng đang khớp bộ lọc. Phiên bản `/after` dùng `react-window` để chỉ tạo các hàng nằm trong vùng nhìn thấy và một vùng đệm nhỏ. Đây là kỹ thuật chính để giảm số lượng phần tử DOM và thời gian chặn luồng chính.

### Memoization

Phiên bản `/after` dùng `useMemo` cho kết quả lọc và thống kê, `useCallback` cho callback ổn định và `React.memo` cho hàng sản phẩm. Việc nhập tìm kiếm hoặc mở chi tiết không làm các phần không liên quan render lại không cần thiết.

### Code-splitting

Hộp chi tiết sản phẩm của phiên bản `/after` được tải bằng `React.lazy` và `Suspense`. Mã của phần này chỉ được tải khi người dùng yêu cầu, giúp giảm JavaScript ban đầu. Phiên bản `/before` nhập trực tiếp cùng thành phần để giữ vai trò đối chứng.

## Tạo khác biệt đo được

Để Lighthouse có thể quan sát vấn đề trên máy hiện đại, mỗi hàng của phiên bản `/before` có một phép tính định dạng/đánh giá nhỏ và toàn bộ 3.000 hàng đều được render. Phép tính phải có kết quả xác định, không dùng vòng lặp cực lớn hoặc độ trễ giả tạo gây treo trang. Phiên bản `/after` vẫn hiển thị cùng kết quả nhưng chỉ tính cho các hàng thực sự được render.

## Giao diện

Giao diện theo phong cách bảng quản trị sinh viên, dùng tiếng Việt và CSS thuần:

- Thanh tiêu đề có tên bài tập và liên kết chuyển giữa hai phiên bản.
- Bốn thẻ thống kê: tổng sản phẩm, còn hàng, sắp hết và tổng giá trị kho.
- Thanh tìm kiếm và bộ lọc danh mục.
- Bảng có tiêu đề cột rõ ràng, vùng cuộn cố định và nút xem chi tiết.
- Nhãn “Chưa tối ưu” và “Đã tối ưu” giúp tránh nhầm lẫn khi trình bày.
- Có trạng thái rỗng khi bộ lọc không trả về sản phẩm.

## Xử lý lỗi và trường hợp biên

- Đường dẫn không hợp lệ chuyển về `/before`.
- Từ khóa được bỏ khoảng trắng thừa và so sánh không phân biệt hoa thường.
- Danh mục không hợp lệ được xem như chọn tất cả.
- Bảng hiển thị thông báo rõ ràng khi không có kết quả.
- `Suspense` hiển thị nội dung chờ trong lúc tải hộp chi tiết.

## Kiểm thử

Kiểm thử tự động tập trung vào hành vi dễ sai và có ý nghĩa với bài tập:

- Bộ tạo dữ liệu trả về đúng 3.000 sản phẩm với mã không trùng nhau.
- Tìm kiếm không phân biệt hoa thường và xử lý khoảng trắng.
- Lọc theo danh mục và kết hợp tìm kiếm hoạt động đúng.
- Danh mục không hợp lệ không làm ứng dụng lỗi.
- Cấu hình trang sau tối ưu sử dụng danh sách ảo hóa và tải động.
- Chạy toàn bộ test, lint và production build trước khi bàn giao.

## Đo Lighthouse

Hai trang được đo từ cùng một production build, cùng cổng, cùng cấu hình Lighthouse và tuần tự trên cùng máy. Mỗi trang được đo ba lần ở chế độ mobile; báo cáo dùng giá trị trung vị để giảm sai số. Lưu cả tệp HTML và JSON gốc trong thư mục `lighthouse-results`.

Các chỉ số bắt buộc:

- Performance score.
- First Contentful Paint (FCP).
- Largest Contentful Paint (LCP).
- Total Blocking Time (TBT).
- Cumulative Layout Shift (CLS).

Script đo phải tự khởi động hoặc kết nối với bản preview, chạy Lighthouse cho `/before` và `/after`, rồi tạo dữ liệu đầu vào cho báo cáo. Nếu Chrome hoặc Lighthouse không chạy được, README phải nêu chính xác lệnh thủ công thay thế; không tự bịa điểm số.

## Báo cáo và tài liệu bàn giao

- `README.md`: hướng dẫn cài đặt, chạy ứng dụng, chạy test, build và đo Lighthouse.
- `BAO_CAO_HIEU_NANG.md`: mô tả vấn đề, môi trường đo, bảng so sánh trước/sau, phần trăm thay đổi và giải thích ba kỹ thuật tối ưu.
- `lighthouse-results`: các báo cáo HTML/JSON trước và sau tối ưu.

Báo cáo phải dùng số liệu lấy từ kết quả Lighthouse thật. Nếu một chỉ số dao động ngược kỳ vọng, báo cáo giải thích tính biến động của phép đo thay vì sửa số thủ công.

## Tiêu chí hoàn thành

- Ứng dụng hiển thị và tìm kiếm/lọc được đúng 3.000 sản phẩm.
- `/before` và `/after` có cùng chức năng, khác nhau ở chiến lược tối ưu.
- Có ít nhất hai kỹ thuật được áp dụng; thiết kế này dùng ba kỹ thuật.
- Có đủ số liệu Lighthouse trước/sau và tệp kết quả gốc.
- Báo cáo Markdown ngắn gọn, dễ hiểu, phù hợp bài tập sinh viên.
- Test, lint và production build hoàn tất không lỗi.
