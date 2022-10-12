import { useEffect, useState } from "react";
import { produce, current } from "immer";
import { Image as BsImage } from "react-bootstrap";
import api from "../../bootstrap/apis";
import axios from "axios";
import MenuModal from "../../components/MenuModal"
import AdminBreadcrumb from "../AdminBreadcrumb";
import Image from "../Image.jsx"
import defaultImage from "../../assets/images/menu_default_image.png";
import "../style/AdminMenus.css";

const AdminMenus = () => {
  const [state, setState] = useState({
    modalAction: "",
    menuToEdit: {},
    menus: [],
    isError: false,
    isLoading: true,
    showModal: false,
  })
  const [reloader, setReloader] = useState(0)

  const handleButtonClick = ({ target }) => {
    setState(
      produce((draft) => {
        draft.menuToEdit = current(draft).menus.find(
          (menu) => menu.id === Number(target.id)
        )
        draft.modalAction = target.name
        draft.showModal = true
      })
    )
  }

  const handleModalToggle = () => {
    setState(
      produce((draft) => {
        draft.showModal = false
      })
    )
  }

  useEffect(() => {
    const controller = new AbortController()
    const fetchMenus = async () => {
      try {
        const response = await api.get("/content/data/timtam")
        setState(
          produce((draft) => {
            draft.isLoading = false
            draft.menus = response.data
          })
        )
      } catch (error) {
        if (!axios.isCancel(error)) {
          setState(
            produce((draft) => {
              draft.isLoading = false
              draft.isError = true
            })
          )
        }
      }
    }
    fetchMenus()

    return () => controller.abort()
  }, [reloader])

  return (
    <div className="admin-menus">
      <AdminBreadcrumb name={"Daftar Menu"} />
      {(state.isLoading || state.isError) ? (
        <h1 className="text-center mt-5">
          {state.isLoading ? "Loading..." : "Ups! Terjadi kesalahan."}
        </h1>
      ) : (
        <>
          <button name="ADD_MENU" className="btn btn-primary mb-3" onClick={handleButtonClick}>Tambah Menu</button>
          <div className="card bg-light-grey">
            <div className="card-body text-center py-0 px-2">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">
                      <p className="fw-semibold" style={{ fontSize: "1.15rem" }}>
                        No
                      </p>
                    </th>
                    <th scope="col">
                      <p className="fw-semibold" style={{ fontSize: "1.15rem" }}>
                        Nama
                      </p>
                    </th>
                    <th scope="col">
                      <p className="fw-semibold" style={{ fontSize: "1.15rem" }}>
                        Kategori
                      </p>
                    </th>
                    <th scope="col">
                      <p className="fw-semibold" style={{ fontSize: "1.15rem" }}>
                        Harga
                      </p>
                    </th>
                    <th scope="col">
                      <p className="fw-semibold" style={{ fontSize: "1.15rem" }}>
                        Deskripsi
                      </p>
                    </th>
                    <th scope="col">
                      <p className="fw-semibold" style={{ fontSize: "1.15rem" }}>
                        Action
                      </p>
                    </th>
                  </tr>
                  {[...state.menus]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((menu, index) => (
                      <tr key={menu.id} className="align-middle">
                        <td>{++index}</td>
                        <td>
                          <div className="d-flex align-items-center text-start">
                            <div className="">
                              <Image
                                as={BsImage}
                                src={menu.image}
                                alt={menu.name}
                                style={{ width: "8rem", borderRadius: "5px" }}
                                fallbackSrc={defaultImage}
                              />
                            </div>
                            <div>
                              <p
                                className="ms-2"
                                style={{ width: "max-content", fontWeight: "600" }}
                              >
                                {menu.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p>
                            {JSON.parse(menu.description2)
                              .map((category) => (
                                category[0].toUpperCase() +
                                category.slice(1)
                              ))
                              .join(", ")
                            }
                          </p>
                        </td>
                        <td>
                          <p style={{ width: "max-content" }}>
                            Rp {Number(menu.description3).toLocaleString("id-ID")},-
                          </p>
                        </td>
                        <td>
                          <p style={{ width: "18rem", fontSize: ".85rem" }}>
                            {menu.description4.length < 125 ?
                              menu.description4 : menu.description4.slice(0, 125) + "..."
                            }
                          </p>
                        </td>
                        <td>
                          <div style={{ width: "max-content" }}>
                            <button
                              id={menu.id}
                              name="EDIT_MENU"
                              className="btn btn-warning mx-2"
                              onClick={handleButtonClick}
                            >Edit</button>
                            <button
                              id={menu.id}
                              name="DELETE_MENU"
                              className="btn btn-danger text-white"
                              onClick={handleButtonClick}
                            >Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </thead>
              </table>
            </div>
          </div>
        </>
      )}
      <MenuModal
        showModal={state.showModal}
        onModalToggle={handleModalToggle}
        action={state.modalAction}
        menu={state.menuToEdit}
        reloadPage={setReloader}
      />
    </div>
  );
};

export default AdminMenus;
