// Đối tác đang làm việc cùng VSAP, hiển thị dạng tường logo ở section "Đối tác" trên trang chủ.
// Chỉ thêm đối tác THẬT đã đồng ý xuất hiện trên website: đặt logo của bên nào là ngầm khẳng định
// quan hệ hợp tác với bên đó.
// Logo: đặt file (ưu tiên SVG hoặc PNG nền trong suốt) vào public/images/partners/ rồi điền `logo`.
// Chưa có logo thì ô hiển thị tên `name` dạng chữ.

export type Partner = {
  name: string;
  logo?: string;
  url?: string;
};

export const partners: Partner[] = [
  { name: "Fine Farm" },
  { name: "Hoàng Khang" },
];
