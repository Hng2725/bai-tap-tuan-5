# Báo cáo tối ưu hiệu năng ReactJS

## 1. Mục tiêu

Ứng dụng quản lý **3.000 sản phẩm** có hai phiên bản cùng dữ liệu và chức năng:

- `/before`: render toàn bộ 3.000 hàng.
- `/after`: áp dụng virtualization, memoization và code-splitting.

Mục tiêu là giảm số phần tử DOM và thời gian JavaScript chiếm luồng chính.

## 2. Cách đo

- Thời gian đo: 01/10/2026.
- Production build của cùng một dự án Vite.
- Google Chrome 154.0.8037.58, Lighthouse 13.5.0, Node.js 24.21.0.
- Chế độ Lighthouse: Mobile.
- Mỗi trang được đo 3 lần liên tiếp; bảng dưới dùng **giá trị trung vị**.
- Báo cáo HTML và JSON gốc được lưu trong thư mục `lighthouse-results`.

## 3. Kết quả trước và sau tối ưu

| Chỉ số | Trước tối ưu | Sau tối ưu | Thay đổi |
|---|---:|---:|---:|
| Performance | 95 điểm | 100 điểm | +5 điểm |
| FCP | 1.206 giây | 1.204 giây | giảm 0.002 giây |
| LCP | 1.209 giây | 1.204 giây | giảm 0.006 giây |
| TBT | 272 ms | 0 ms | giảm 272 ms (100%) |
| CLS | 0 | 0 | không đổi |

Kết quả chi tiết ba lần chạy:

- Trước tối ưu: Performance **98, 94, 95**; TBT **151.5, 289.3, 271.7 ms**.
- Sau tối ưu: Performance **100, 100, 100**; TBT đều bằng **0 ms**.

FCP và LCP chỉ giảm nhẹ vì cả hai trang đều dùng dữ liệu cục bộ, không tải ảnh và có cùng phần đầu giao diện. Sự khác biệt rõ nhất nằm ở TBT: bản trước phải tạo 3.000 hàng DOM, còn bản sau chỉ tạo khoảng 13 hàng đang nhìn thấy.

## 4. Vấn đề của phiên bản trước tối ưu

1. Toàn bộ 3.000 sản phẩm được render ngay khi mở trang.
2. Khi tìm kiếm hoặc chọn danh mục, hàm lọc và thống kê được chạy lại trong mỗi lần render.
3. Hộp chi tiết được nhập trực tiếp vào bundle ban đầu.

Các vấn đề trên làm trình duyệt mất thêm thời gian tạo phần tử, tính layout và thực thi JavaScript.

## 5. Giải pháp đã áp dụng

### Virtualization

Danh sách sau tối ưu có chiều cao hàng cố định. Dựa trên vị trí cuộn, ứng dụng chỉ render các hàng trong vùng nhìn thấy cùng ba hàng đệm. Tổng chiều cao giả vẫn được giữ để thanh cuộn hoạt động bình thường.

Kết quả: số hàng DOM giảm từ tối đa 3.000 xuống khoảng 13 hàng.

### Memoization

- `useMemo` ghi nhớ kết quả lọc và thống kê.
- `useCallback` giữ ổn định hàm chọn/đóng sản phẩm.
- `React.memo` tránh render lại hàng sản phẩm khi props không đổi.

Kết quả: thao tác trên trang không làm các phần không liên quan tính toán và render lại không cần thiết.

### Code-splitting

Hộp chi tiết ở bản sau được tải bằng `React.lazy` và hiển thị trạng thái chờ bằng `Suspense`. Production build tạo file chunk `ProductDetailsLazy-*.js` riêng và chỉ tải khi người dùng bấm **Xem**.

## 6. Kết luận

Sau tối ưu, điểm Performance trung vị tăng từ **95 lên 100** và TBT giảm từ khoảng **272 ms xuống 0 ms**. Virtualization đem lại tác động lớn nhất đối với danh sách dài; memoization giúp hạn chế xử lý lặp lại và code-splitting giảm mã JavaScript cần tải ban đầu.

Kết quả Lighthouse có thể dao động nhẹ giữa các máy hoặc các lần đo. Vì vậy bài làm lưu kết quả gốc và dùng trung vị của ba lần chạy thay vì chọn lần có điểm cao nhất.
