import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  ExternalLink,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { products } from "./Shopping";
import "../styles/Shopping.css";

const formatPrice = (value: number) =>
  `${value.toLocaleString("vi-VN")} đ`;

export default function ShoppingDetail() {
  const { id } = useParams();
  const product = products.find((item) => String(item.id) === id);

  if (!product) return <Navigate to="/shopping" replace />;

  return (
    <div className="shopping-detail-page">
      <nav className="shopping-detail-breadcrumb" aria-label="Điều hướng">
        <Link to="/">Trang chủ</Link>
        <span>/</span>
        <Link to="/shopping">Mua sắm &amp; Dịch vụ</Link>
        <span>/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <article className="shopping-detail-card">
        <div className="shopping-detail-product">
          <img
            className="shopping-detail-image"
            src={product.image}
            alt={product.name}
          />

          <div className="shopping-detail-information">
            <header className="shopping-detail-header">
              <div>
                <h1>{product.name}</h1>
                <span className="shopping-detail-category">
                  {product.category}
                </span>
              </div>
              <Link
                className="shopping-detail-back"
                to="/shopping"
                aria-label="Quay lại danh sách mua sắm"
              >
                <ArrowLeft size={18} />
              </Link>
            </header>

            <p className="shopping-detail-price">
              <span>Giá tham khảo:</span>
              <strong>
                {formatPrice(product.price)}
                {product.priceMax ? ` - ${formatPrice(product.priceMax)}` : ""}
              </strong>
            </p>

            <p className="shopping-detail-location-count">
              <ShoppingBag size={17} />
              {product.shops > 0
                ? `Có tại ${product.shops} địa chỉ mua hàng ở Huế`
                : "Chưa có địa chỉ bán được cập nhật"}
            </p>

            <div className="shopping-detail-divider" />

            <div className="shopping-detail-description">
              {(product.detailSections ?? [
                {
                  title: "Giới thiệu",
                  paragraphs: [product.description],
                },
              ]).map((section) => (
                <section key={section.title}>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.title}-${index}`}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </div>

        <aside className="shopping-detail-seller">
          <h2>Địa chỉ mua hàng ({product.sellers?.length ?? 0})</h2>
          {product.sellers?.length ? (
            <div className="shopping-detail-seller-grid">
              {product.sellers.map((seller) => (
                <section
                  className="shopping-detail-seller-card"
                  key={seller.url}
                >
                  <strong>{seller.name}</strong>
                  {seller.type && <span>{seller.type}</span>}
                  <p>
                    <MapPin size={16} />
                    <span>{seller.address}</span>
                  </p>
                  {seller.opens && seller.closes && (
                    <p>
                      <Clock3 size={16} />
                      <span>
                        Giờ hoạt động: {seller.opens} - {seller.closes}
                      </span>
                    </p>
                  )}
                  {seller.phone && (
                    <p>
                      <Phone size={16} />
                      <a
                        href={`tel:${seller.phone
                          .split(/[;,]/, 1)[0]
                          .trim()
                          .replace(/[^\d+]/g, "")}`}
                      >
                        {seller.phone}
                      </a>
                    </p>
                  )}
                  <a
                    className="shopping-detail-seller-link"
                    href={`https://huetripo.hue.gov.vn${seller.url}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Xem điểm bán <ExternalLink size={14} />
                  </a>
                </section>
              ))}
            </div>
          ) : (
            <p className="shopping-detail-no-sellers">
              Huế TRIPO hiện chưa ghi nhận địa chỉ bán cho sản phẩm này. Vui
              lòng kiểm tra lại với cửa hàng trước khi mua.
            </p>
          )}
          {product.sellers?.length ? (
            <p className="shopping-detail-seller-note">
              Giá, giờ hoạt động và tình trạng hàng có thể thay đổi. Vui lòng
              liên hệ điểm bán để xác nhận trước khi đến.
            </p>
          ) : null}
        </aside>

        <footer className="shopping-detail-footer">
          <Link to="/shopping">
            <ArrowLeft size={16} /> Quay lại mua sắm
          </Link>
          {product.detailUrl && (
            <a href={product.detailUrl} target="_blank" rel="noreferrer">
              Xem nguồn Huế TRIPO <ExternalLink size={15} />
            </a>
          )}
        </footer>
      </article>
    </div>
  );
}
