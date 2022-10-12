import { useState } from "react";
import { Image as BsImage } from "react-bootstrap";
import useCollapse from "react-collapsed";
import Image from "./Image";
import defaultImage from "../assets/images/menu_default_image.png";

const MenuOrderLess = ({ item }) => {
  const [isExpanded, setExpanded] = useState(true);
  const { getToggleProps } = useCollapse();

  return (
    <>
      {isExpanded
        ? item.dataPesananUser.pesananUser.slice(0, 3).map((value, key) => (
            <div key={key} className="d-flex align-items-center mb-2">
              <div>
                <Image
                  as={BsImage}
                  src={value.image}
                  alt={value.name}
                  style={{ width: "6.5rem", borderRadius: "15px" }}
                  fallbackSrc={defaultImage}
                />
              </div>
              <div className="ms-3">
                <p
                  className="mb-1"
                  style={{ fontSize: "1.15rem", fontWeight: "600" }}
                >
                  {value.name}
                </p>
                <p className="mb-1">
                  {value.quantity} x Rp. {Number(value.description3).toLocaleString("id-ID")}
                  ,-
                </p>
              </div>
            </div>
          ))
        : item.dataPesananUser.pesananUser.map((value, key) => (
            <div key={key} className="d-flex align-items-center mb-2">
              <div>
                <Image
                  as={BsImage}
                  src={value.image}
                  alt={value.name}
                  style={{ width: "6.5rem", borderRadius: "15px" }}
                  fallbackSrc={defaultImage}
                />
              </div>
              <div className="ms-3">
                <p
                  className="mb-1"
                  style={{ fontSize: "1.15rem", fontWeight: "600" }}
                >
                  {value.name}
                </p>
                <p className="mb-1">
                  {value.quantity} x Rp.{" "}
                  {Number(value.description3).toLocaleString("id-ID")}
                  ,-
                </p>
              </div>
            </div>
          ))}
      {item.dataPesananUser.pesananUser.length > 3 && (
        <h6
          {...getToggleProps({
            onClick: () => setExpanded((prevExpanded) => !prevExpanded),
          })}
          className="fw-semibold"
          style={{
            cursor: "pointer",
            color: "#333",
          }}
        >
          {!isExpanded ? "...SHOW LESS" : "...SHOW MORE"}
        </h6>
      )}
    </>
  );
};

export default MenuOrderLess;
