# Product Performance Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng ứng dụng ReactJS quản lý 3.000 sản phẩm, đo Lighthouse trước và sau khi áp dụng virtualization, memoization và code-splitting, rồi ghi kết quả thật vào báo cáo Markdown.

**Architecture:** Một Vite SPA có hai URL `/before` và `/after`, dùng chung dữ liệu và hàm lọc nhưng dùng hai chiến lược render khác nhau. Bản trước render toàn bộ danh sách; bản sau dùng virtualization tự cài đặt với chiều cao hàng cố định, memoization và một hộp chi tiết tải động. Script Node điều phối production preview, chạy Lighthouse ba lần mỗi URL và tính trung vị.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, CSS, Lighthouse CLI, Chrome.

**Spec:** `docs/superpowers/specs/2026-10-01-product-performance-design.md`

## Global Constraints

- Dữ liệu gồm đúng 3.000 sản phẩm cố định ở phía trình duyệt; không dùng backend.
- `/before` và `/after` phải có cùng dữ liệu, giao diện và chức năng.
- Giao diện và tài liệu dùng tiếng Việt, phù hợp bài tập sinh viên.
- Không thêm đăng nhập, phân quyền, CRUD máy chủ hoặc cơ sở dữ liệu.
- Lighthouse chạy trên cùng production build, ba lần mỗi trang ở chế độ mobile và báo cáo giá trị trung vị.
- Không ghi số Lighthouse giả; báo cáo chỉ dùng kết quả đo thật.

## Review Focus

- Đường dẫn lạ phải điều hướng về `/before`; kiểm thử tại Task 3.
- Từ khóa chỉ chứa khoảng trắng phải trả về toàn bộ danh sách; kiểm thử tại Task 2.
- Danh mục lạ phải được xem như “Tất cả”; kiểm thử tại Task 2.
- Danh sách rỗng sau lọc phải hiện thông báo thay vì bảng trống hoặc lỗi; kiểm thử tại Task 3.
- Vùng ảo hóa ở đầu và cuối danh sách không được tạo chỉ số âm hoặc vượt số phần tử; kiểm thử tại Task 4.

---

## File Structure

- `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`: cấu hình ứng dụng, kiểm thử và build.
- `src/domain/product.ts`: kiểu dữ liệu sản phẩm.
- `src/domain/product-data.ts`: tạo đúng 3.000 sản phẩm xác định.
- `src/domain/product-query.ts`: chuẩn hóa, tìm kiếm, lọc và thống kê.
- `src/domain/virtual-range.ts`: tính phạm vi hàng cần render.
- `src/components/*`: header, toolbar, thẻ thống kê, bảng thường, bảng ảo hóa và modal chi tiết.
- `src/pages/BeforePage.tsx`: trang đối chứng chưa tối ưu.
- `src/pages/AfterPage.tsx`: trang dùng ba kỹ thuật tối ưu.
- `src/App.tsx`: chọn trang theo URL và xử lý URL sai.
- `src/styles.css`: giao diện responsive dùng chung.
- `tests/*`: kiểm thử domain, routing, hai trang và virtualization.
- `scripts/lighthouse.mjs`: chạy preview, Lighthouse và tạo `summary.json`.
- `scripts/lighthouse-summary.mjs`: các hàm thuần tính trung vị/trích chỉ số.
- `lighthouse-results/*`: JSON và HTML từ sáu lần đo.
- `README.md`, `BAO_CAO_HIEU_NANG.md`: hướng dẫn và báo cáo cuối cùng.

### Task 1: Scaffold và dữ liệu 3.000 sản phẩm

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/domain/product.ts`
- Create: `src/domain/product-data.ts`
- Test: `tests/product-data.test.ts`

**Interfaces:**
- Produces: `Product`, `ProductCategory`, `PRODUCT_CATEGORIES`, `createProducts(count: number): Product[]`, `PRODUCT_COUNT = 3000`.

- [ ] **Step 1: Tạo cấu hình tối thiểu và viết test thất bại cho dữ liệu**

Test `createProducts(3000)` có độ dài 3.000, mã sản phẩm không trùng, dữ liệu đầu/cuối ổn định, giá và tồn kho không âm.

- [ ] **Step 2: Chạy test để xác nhận RED**

Run: `npm test -- tests/product-data.test.ts`
Expected: FAIL vì `src/domain/product-data.ts` chưa tồn tại.

- [ ] **Step 3: Cài đặt model và bộ tạo dữ liệu tối thiểu**

Tạo dữ liệu xác định từ chỉ số, không dùng `Math.random()`, để cả hai trang và mọi lần đo dùng cùng nội dung.

- [ ] **Step 4: Chạy test để xác nhận GREEN**

Run: `npm test -- tests/product-data.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit nếu repository Git khả dụng**

`git add package.json index.html vite.config.ts tsconfig*.json src/main.tsx src/domain tests/product-data.test.ts && git commit -m "feat: scaffold product performance demo"`

### Task 2: Truy vấn và thống kê sản phẩm

**Files:**
- Create: `src/domain/product-query.ts`
- Test: `tests/product-query.test.ts`

**Interfaces:**
- Consumes: `Product`, `ProductCategory`, `PRODUCT_CATEGORIES` từ Task 1.
- Produces: `filterProducts(products, search, category): Product[]`, `calculateStats(products): ProductStats`, `ProductStats`.

- [ ] **Step 1: Viết test thất bại cho tìm kiếm, lọc và thống kê**

Kiểm tra tìm kiếm không phân biệt hoa thường, bỏ khoảng trắng, từ khóa trắng trả toàn bộ, kết hợp danh mục, danh mục lạ trả toàn bộ danh mục, danh sách rỗng và tổng giá trị kho.

- [ ] **Step 2: Chạy test để xác nhận RED**

Run: `npm test -- tests/product-query.test.ts`
Expected: FAIL vì module truy vấn chưa tồn tại.

- [ ] **Step 3: Cài đặt các hàm thuần**

`filterProducts` không thay đổi mảng đầu vào; `calculateStats` trả `total`, `inStock`, `lowStock` và `inventoryValue`.

- [ ] **Step 4: Chạy test để xác nhận GREEN**

Run: `npm test -- tests/product-query.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit nếu repository Git khả dụng**

`git add src/domain/product-query.ts tests/product-query.test.ts && git commit -m "feat: add product query and statistics"`

### Task 3: Giao diện dùng chung và trang chưa tối ưu

**Files:**
- Create: `src/App.tsx`
- Create: `src/components/AppHeader.tsx`
- Create: `src/components/ProductToolbar.tsx`
- Create: `src/components/StatsCards.tsx`
- Create: `src/components/ProductDetailsStatic.tsx`
- Create: `src/components/ProductTable.tsx`
- Create: `src/pages/BeforePage.tsx`
- Create: `src/styles.css`
- Test: `tests/app-routing.test.tsx`
- Test: `tests/before-page.test.tsx`

**Interfaces:**
- Consumes: dữ liệu và hàm truy vấn từ Task 1-2.
- Produces: `App`, `BeforePage`, các component trình bày dùng lại ở Task 4.

- [ ] **Step 1: Viết test thất bại cho routing và hành vi trang `/before`**

Kiểm tra nhãn “Chưa tối ưu”, tổng 3.000 sản phẩm, tìm kiếm/lọc, thông báo không có kết quả, mở/đóng chi tiết; URL lạ gọi `history.replaceState` về `/before`.

- [ ] **Step 2: Chạy test để xác nhận RED**

Run: `npm test -- tests/app-routing.test.tsx tests/before-page.test.tsx`
Expected: FAIL vì component chưa tồn tại.

- [ ] **Step 3: Cài đặt giao diện và bản đối chứng**

`BeforePage` cố ý gọi `filterProducts` và `calculateStats` trực tiếp khi render, render mọi hàng kết quả và nhập tĩnh `ProductDetailsStatic`.

- [ ] **Step 4: Chạy test để xác nhận GREEN**

Run: `npm test -- tests/app-routing.test.tsx tests/before-page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit nếu repository Git khả dụng**

`git add src tests/app-routing.test.tsx tests/before-page.test.tsx && git commit -m "feat: add unoptimized product page"`

### Task 4: Virtualization, memoization và code-splitting

**Files:**
- Create: `src/domain/virtual-range.ts`
- Create: `src/components/VirtualProductTable.tsx`
- Create: `src/components/ProductRow.tsx`
- Create: `src/components/ProductDetailsLazy.tsx`
- Create: `src/pages/AfterPage.tsx`
- Modify: `src/App.tsx`
- Test: `tests/virtual-range.test.ts`
- Test: `tests/after-page.test.tsx`

**Interfaces:**
- Consumes: `Product`, `filterProducts`, `calculateStats` và component dùng chung.
- Produces: `getVirtualRange({ itemCount, itemHeight, viewportHeight, scrollTop, overscan }): VirtualRange`, `VirtualProductTable`, `AfterPage`.

- [ ] **Step 1: Viết test thất bại cho phạm vi ảo hóa**

Kiểm tra vị trí đầu, giữa, cuối, danh sách rỗng và scroll vượt biên; `startIndex >= 0`, `endIndex <= itemCount`, `offsetTop = startIndex * itemHeight`.

- [ ] **Step 2: Chạy test phạm vi để xác nhận RED**

Run: `npm test -- tests/virtual-range.test.ts`
Expected: FAIL vì module chưa tồn tại.

- [ ] **Step 3: Cài đặt hàm phạm vi và xác nhận GREEN**

Run: `npm test -- tests/virtual-range.test.ts`
Expected: PASS.

- [ ] **Step 4: Viết test thất bại cho trang `/after`**

Kiểm tra nhãn “Đã tối ưu”, chỉ một tập con nhỏ hàng được render cho 3.000 sản phẩm, tìm kiếm/lọc vẫn đúng, trạng thái rỗng và fallback “Đang tải chi tiết...” xuất hiện khi mở modal.

- [ ] **Step 5: Chạy test trang để xác nhận RED**

Run: `npm test -- tests/after-page.test.tsx`
Expected: FAIL vì `AfterPage` chưa tồn tại.

- [ ] **Step 6: Cài đặt ba kỹ thuật tối ưu**

`AfterPage` dùng `useMemo` cho lọc/thống kê, `useCallback` cho chọn sản phẩm, `React.memo` cho `ProductRow`; `VirtualProductTable` dùng hàng cao cố định và overscan; `ProductDetailsLazy` được import qua `React.lazy` và `Suspense`.

- [ ] **Step 7: Chạy test để xác nhận GREEN**

Run: `npm test -- tests/after-page.test.tsx tests/virtual-range.test.ts`
Expected: PASS.

- [ ] **Step 8: Commit nếu repository Git khả dụng**

`git add src tests/virtual-range.test.ts tests/after-page.test.tsx && git commit -m "feat: add optimized product page"`

### Task 5: Hoàn thiện trải nghiệm và kiểm tra bundle

**Files:**
- Modify: `src/styles.css`
- Modify: `src/App.tsx`
- Test: `tests/accessibility.test.tsx`

**Interfaces:**
- Consumes: toàn bộ UI từ Task 3-4.
- Produces: giao diện responsive hoàn chỉnh và bundle có chunk tải động riêng.

- [ ] **Step 1: Viết test thất bại cho điều hướng và accessibility cơ bản**

Kiểm tra hai liên kết phiên bản, label cho input/select, tiêu đề bảng, tên nút chi tiết và modal có tên truy cập được.

- [ ] **Step 2: Chạy test để xác nhận RED**

Run: `npm test -- tests/accessibility.test.tsx`
Expected: FAIL ở các nhãn hoặc vai trò còn thiếu.

- [ ] **Step 3: Hoàn thiện semantic HTML và CSS responsive**

Giữ chiều cao cố định cho vùng danh sách để tránh CLS; trên màn hình nhỏ cho phép bảng cuộn ngang, không ẩn dữ liệu bắt buộc.

- [ ] **Step 4: Chạy test và build**

Run: `npm test && npm run build`
Expected: toàn bộ test PASS; build tạo chunk riêng cho `ProductDetailsLazy`.

- [ ] **Step 5: Commit nếu repository Git khả dụng**

`git add src tests/accessibility.test.tsx && git commit -m "feat: polish product dashboard"`

### Task 6: Đo Lighthouse tự động và viết báo cáo

**Files:**
- Create: `scripts/lighthouse-summary.mjs`
- Create: `scripts/lighthouse.mjs`
- Modify: `package.json`
- Create: `tests/lighthouse-summary.test.ts`
- Create: `README.md`
- Create: `BAO_CAO_HIEU_NANG.md`
- Create: `lighthouse-results/.gitkeep`

**Interfaces:**
- Produces: `median(values: number[]): number`, `extractMetrics(lhr): LighthouseMetrics`, lệnh `npm run lighthouse`, `lighthouse-results/summary.json`.

- [ ] **Step 1: Viết test thất bại cho tính trung vị và trích chỉ số**

Kiểm tra trung vị ba lần đo và ánh xạ chính xác Performance, FCP, LCP, TBT, CLS từ Lighthouse JSON; dữ liệu thiếu phải báo lỗi rõ ràng.

- [ ] **Step 2: Chạy test để xác nhận RED**

Run: `npm test -- tests/lighthouse-summary.test.ts`
Expected: FAIL vì module summary chưa tồn tại.

- [ ] **Step 3: Cài đặt helper và trình điều phối Lighthouse**

Script build ứng dụng, khởi động Vite preview ở cổng cố định, chờ HTTP sẵn sàng, chạy Lighthouse CLI ba lần cho mỗi URL bằng Chrome headless, lưu JSON/HTML, tính trung vị và luôn dừng tiến trình preview trong `finally`.

- [ ] **Step 4: Chạy test và build để xác nhận GREEN**

Run: `npm test && npm run build`
Expected: toàn bộ test PASS và production build thành công.

- [ ] **Step 5: Chạy Lighthouse thật**

Run: `npm run lighthouse`
Expected: có sáu cặp báo cáo HTML/JSON và `lighthouse-results/summary.json` chứa trung vị trước/sau.

- [ ] **Step 6: Điền báo cáo từ kết quả thật**

Ghi môi trường đo, bảng Performance/FCP/LCP/TBT/CLS, chênh lệch tuyệt đối hoặc phần trăm, nguyên nhân vấn đề và giải thích virtualization, memoization, code-splitting vào `BAO_CAO_HIEU_NANG.md`. README ghi đủ lệnh cài đặt, dev, test, build, preview và Lighthouse.

- [ ] **Step 7: Xác minh cuối**

Run: `npm test && npm run lint && npm run build`
Expected: tất cả lệnh thành công; báo cáo không còn placeholder; các file Lighthouse tồn tại và khớp `summary.json`.

- [ ] **Step 8: Commit nếu repository Git khả dụng**

`git add package.json scripts tests/lighthouse-summary.test.ts README.md BAO_CAO_HIEU_NANG.md lighthouse-results && git commit -m "docs: add lighthouse performance comparison"`

