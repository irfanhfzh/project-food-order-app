import { Card, Image as BsImage } from "react-bootstrap";
import { Link } from "react-router-dom";
import add from "../assets/icons/menu_add.svg";
import defaultImage from "../assets/images/menu_default_image.png";
import Image from "./Image";
import "./style/HomeSectionMenu.css";

const HomeCardMenu = ({ menu, handleAddProduct }) => {
  return (
    <div className="home-card-menu">
      <Card className="p-3">
        <div className="d-flex align-items-center">
          <Link to={`/menu/${menu.description1}`}>
            <div>
              <Image
                as={BsImage}
                style={{
                  width: "7rem",
                  height: "7rem",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                className="rounded"
                src={menu.image}
                fallbackSrc={defaultImage}
              />
            </div>
          </Link>
          <div className="mx-3">
            <h4 className="subtitle">{menu.name}</h4>
            <p>Rp. {Number(menu.description3).toLocaleString("id-ID")},-</p>
          </div>
          <div className="mt-auto ms-auto">
            <div
              className="btn-add"
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleAddProduct(menu);
              }}
            >
              <Image as={BsImage} src={add} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomeCardMenu;
