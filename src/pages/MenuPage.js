import { Container, Row, Col, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ButtonCategory from "../components/ButtonMenu";
import Menu from "../components/Menu";
import MenuSelect from "../components/MenuSelect";
import BannerImg from "../assets/images/menu_banner-img.png";
import produce from "immer";
import api from "../bootstrap/apis";
import axios from "axios";
import "./style/MenuPage.css";

const MenuPage = ({ handleAddProduct }) => {
  const categoryList = useSelector((state) => state.categories);
  const [state, setState] = useState({
    menus: [],
    isError: false,
    isLoading: true,
    isMobile: true,
    selectedCategory: "semua",
    showModal: false,
  });

  const toggleIsMobile = () => {
    if (window.innerWidth >= 768)
      setState(
        produce((draft) => {
          draft.isMobile = false;
        })
      );
    else
      setState(
        produce((draft) => {
          draft.isMobile = true;
        })
      );
  };

  const handleSelectChange = ({ target }) => {
    setState(
      produce((draft) => {
        draft.selectedCategory = target.value;
      })
    );
  };

  const handleButtonCategoryClick = ({ target }) => {
    setState(
      produce((draft) => {
        draft.selectedCategory = target.id;
      })
    );
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchMenus = async () => {
      try {
        const response = await api.get("/content/data/timtam");
        setState(
          produce((draft) => {
            draft.isLoading = false;
            draft.menus = response.data;
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
    toggleIsMobile();
    window.addEventListener("resize", toggleIsMobile);

    return () => {
      controller.abort();
      window.removeEventListener("resize", toggleIsMobile);
    };
  }, []);

  return (
    <div className="menu-page mb-5">
      <Container>
        <div className="mt-4 text-center">
          <a href="#jelajahi-menu">
            <Image src={BannerImg} fluid />
          </a>
        </div>
        <div id="jelajahi-menu" className="mt-5">
          {state.isLoading || state.isError ? (
            <h1 className="text-center mt-5">
              {state.isLoading ? "Loading..." : "Ups! Terjadi kesalahan."}
            </h1>
          ) : (
            <Row
              xs="auto"
              className="justify-content-center align-items-center g-0 gap-2 gap-lg-4"
              style={{ rowGap: "0.5rem" }}
            >
              {state.isMobile ? (
                <Col>
                  <MenuSelect
                    selectedCategory={state.selectedCategory}
                    onSelectChange={handleSelectChange}
                  />
                </Col>
              ) : (
                categoryList.map((category, index) => (
                  <Col key={index}>
                    <ButtonCategory
                      selectedCategory={state.selectedCategory}
                      label={category}
                      onButtonCategoryClick={handleButtonCategoryClick}
                    />
                  </Col>
                ))
              )}
            </Row>
          )}
          <Row sm={2} lg={3} xl={4} xxl={5} className="py-5 menu-row">
            {[...state.menus]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((menu, index) => {
                if (state.selectedCategory === "semua") {
                  return (
                    <Menu
                      key={menu.id}
                      menu={menu}
                      handleAddProduct={handleAddProduct}
                    />
                  );
                }
                if (menu.description2.includes(state.selectedCategory)) {
                  return (
                    <Menu
                      key={menu.id}
                      menu={menu}
                      handleAddProduct={handleAddProduct}
                    />
                  );
                } else {
                  return null;
                }
              })}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default MenuPage;
