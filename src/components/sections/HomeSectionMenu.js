import { Col, Container, Image, Row } from "react-bootstrap";
import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import produce from "immer";
import ButtonCategory from "../ButtonMenu";
import HomeCardMenu from "../HomeCardMenu";
import HeroMenu from "../../assets/images/menu_img.png";
import HeroNasiGoreng from "../../assets/images/menu_img_nasi-goreng.png";
import MenuSelect from "../MenuSelect";
import api from "../../bootstrap/apis";
import axios from "axios";
import "../style/HomeSectionMenu.css";

const Menu = ({ handleAddProduct }) => {
  const categoryList = useSelector((state) => state.categories);
  const [state, setState] = useState({
    menus: [],
    isError: false,
    isLoading: true,
    isMobile: true,
    selectedCategory: "semua",
    width: 0,
  });
  const carouselMenu = useRef();

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
    setState(
      produce((draft) => {
        draft.width = carouselMenu.current.setWidth =
          1719 - carouselMenu.current.offsetWidth;
      })
    );

    return () => {
      controller.abort();
      window.removeEventListener("resize", toggleIsMobile);
    };
  }, []);

  return (
    <div className="menu-section" id="pesan-menu">
      <Container ref={carouselMenu}>
        <h4 className="text-center subtitle">Menu</h4>
        <h1 className="text-center title">
          Apa yang Kamu Idamkan <br /> dalam Menu ini?
        </h1>
        {state.isLoading || state.isError ? (
          <h1 className="text-center mt-5">
            {state.isLoading ? "Loading..." : "Ups! Terjadi kesalahan."}
          </h1>
        ) : (
          <>
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

            <motion.div className="overflow-hidden">
              <motion.div
                drag="x"
                dragConstraints={{ right: 0, left: -state.width }}
                dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
                whileTap={{ cursor: "grabbing" }}
                className="d-flex mt-4 menu"
                style={{ cursor: "grab" }}
              >
                <motion.div
                  className="position-relative m-auto"
                  style={{ pointerEvents: "none" }}
                >
                  <Image style={{ width: "20rem" }} src={HeroMenu} />
                  <motion.div
                    className="position-absolute"
                    style={{ right: "-40px", bottom: "75px" }}
                  >
                    <Image style={{ width: "25rem" }} src={HeroNasiGoreng} />
                  </motion.div>
                </motion.div>
                <motion.div className="pilih-menu d-flex px-3">
                  {[...state.menus]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((menu) => {
                      if (state.selectedCategory === "semua") {
                        return (
                          <HomeCardMenu
                            key={menu.id}
                            menu={menu}
                            handleAddProduct={handleAddProduct}
                          />
                        );
                      }
                      if (menu.description2.includes(state.selectedCategory)) {
                        return (
                          <HomeCardMenu
                            key={menu.id}
                            menu={menu}
                            handleAddProduct={handleAddProduct}
                          />
                        );
                      } else {
                        return null;
                      }
                    })}
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </Container>
    </div>
  );
};

export default Menu;
