import {
  Container,
  Row,
  Col,
  Card,
  Image as BsImage,
  Button,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import produce from "immer";
import Image from "../components/Image";
import defaultImage from "../assets/images/menu_default_image.png";
import RightIcon from "../assets/icons/right.svg";
import api from "../bootstrap/apis";
import axios from "axios";
import "./style/DetailMenuPage.css";

const DetailMenuPage = ({ handleAddProduct }) => {
  const { menuSlug } = useParams();
  const [state, setState] = useState({
    isLoading: true,
    isError: false,
    menu: {},
  });

  useEffect(() => {
    const controller = new AbortController();
    const fetchMenus = async () => {
      try {
        const response = await api.get("/content/data/timtam");
        const targetMenu = response.data.find(
          (menu) => menu.description1 === menuSlug
        );
        if (!targetMenu) throw new Error("Menu tidak dapat ditemukan.");
        setState(
          produce((draft) => {
            draft.isLoading = false;
            draft.menu = targetMenu;
          })
        );
      } catch (error) {
        if (!axios.isCancel(error)) {
          setState(
            produce((draft) => {
              draft.isLoading = false;
              draft.isError = true;
            })
          );
        }
      }
    };
    fetchMenus();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="detail-menu-page py-5 mb-5">
      <Container>
        {state.isLoading || state.isError ? (
          <h1 className="text-center mt-5">
            {state.isLoading ? "Loading..." : "Ups! Terjadi kesalahan."}
          </h1>
        ) : (
          <>
            <p>
              <Link to={"/"}>
                <span className="text-muted">Beranda</span>
              </Link>
              <BsImage src={RightIcon} />
              <Link to={"/menu"}>
                <span className="text-muted">Menu</span>
              </Link>
              <BsImage src={RightIcon} />
              <span className="fw-semibold">{state.menu.name}</span>
            </p>
            <Card>
              <Row xs={1} lg={2} className="g-0">
                <Col>
                  <Image
                    as={BsImage}
                    src={state.menu.image}
                    fallbackSrc={defaultImage}
                    alt={state.menu.name}
                    fluid={true}
                    className="w-100"
                  />
                </Col>
                <Col className="p-3 p-lg-4 p-xl-5">
                  <h1 className="title mb-1">{state.menu.name}</h1>
                  <p>
                    <span className="fw-semibold">Kategori :</span>{" "}
                    {JSON.parse(state.menu.description2)
                      .map((w) => w[0].toUpperCase() + w.slice(1))
                      .join(", ")}
                  </p>
                  <h4 className="subtitle">
                    Rp.{" "}
                    {Number(state.menu.description3).toLocaleString("id-ID")},-
                  </h4>
                  <p>{state.menu.description4}</p>
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={() => handleAddProduct(state.menu)}
                  >
                    Tambah ke Pesanan
                  </Button>
                </Col>
              </Row>
            </Card>
          </>
        )}
      </Container>
    </div>
  );
};

export default DetailMenuPage;
