import { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setOrderItems } from "../../bootstrap/actions";
import swal from "sweetalert";
import AdminBreadcrumb from "../AdminBreadcrumb";
import Description from "../Description";
import ModalDetailOrder from "../ModalDetailOrder";
import produce from "immer";
import api from "../../bootstrap/apis";
import axios from "axios";
import "../style/AdminDashboard.css";

const AdminDashboard = () => {
  const { orderItems } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [reversed, setReversed] = useState(true);
  const [state, setState] = useState({
    isLoading: true,
    isError: false,
    menus: []
  })

  const addOrderToQueueReversed = (i, status) => {
    const orderItemsExist = [...orderItems]
      .reverse()
      .find((item, index) => index === i);
    if (orderItemsExist) {
      dispatch(
        setOrderItems(
          [...orderItems]
            .reverse()
            .map((item, index) => (index === i ? (item.status = status) : item))
        )
      );
      dispatch(setOrderItems(orderItems));
      orderItems.map((item) =>
        swal({
          title: "Sukses Menerima Pesanan!",
          text: "Pesanan " + item.user + " sudah diterima",
          icon: "success",
          button: false,
          timer: 1750,
        })
      );
    }
  };

  const addOrderToQueue = (i, status) => {
    const orderItemsExist = orderItems.find((item, index) => index === i);
    if (orderItemsExist) {
      dispatch(
        setOrderItems(
          orderItems.map((item, index) =>
            index === i ? (item.status = status) : item
          )
        )
      );
      dispatch(setOrderItems(orderItems));
      orderItems.map((item) =>
        swal({
          title: "Sukses Menerima Pesanan!",
          text: "Pesanan " + item.user + " sudah diterima",
          icon: "success",
          button: false,
          timer: 1750,
        })
      );
    }
  };

  const addAllOrderToQueue = (status) => {
    const orderItemsExist = orderItems.filter(
      (item) => item.status === "Pending"
    );
    if (orderItemsExist) {
      dispatch(
        setOrderItems(
          [...orderItems],
          orderItems.filter((item) =>
            item.status === "Pending" ? (item.status = status) : item
          )
        )
      );
      dispatch(setOrderItems(orderItems));
      swal({
        title: "Sukses Menerima Semua Pesanan!",
        text: "Pesanan sudah diterima semua",
        icon: "success",
        button: false,
        timer: 1750,
      });
    }
  };

  const removeOrderItemsReversed = (i) => {
    dispatch(
      setOrderItems(
        [...orderItems].reverse().filter((item, index) => index !== i)
      )
    );
    setReversed(!reversed);
    orderItems.map((item) =>
      swal({
        title: "Sukses Menghapus Pesanan!",
        text: "Pesanan " + item.user + " sudah dihapus",
        icon: "success",
        button: false,
        timer: 1750,
      })
    );
  };

  const removeOrderItems = (i) => {
    dispatch(setOrderItems(orderItems.filter((item, index) => index !== i)));
    setReversed(reversed);
    orderItems.map((item) =>
      swal({
        title: "Sukses Menghapus Pesanan!",
        text: "Pesanan " + item.user + " sudah dihapus",
        icon: "success",
        button: false,
        timer: 1750,
      })
    );
  };

  const [show, setShow] = useState("");
  const handleClose = () => setShow("");

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
  }, [])

  return (
    <div className="admin-dashboard">
      <AdminBreadcrumb name={"Dashboard"} />
      <div className="db d-flex justify-content-between">
        <div>
          <div className="d-flex justify-content-center gap-4">
            <div className="card-dashboard d-flex flex-column justify-content-center align-items-center gap-2 px-2">
              <div className="d-flex flex-column align-items-center">
                <h2>10</h2>
                <h4 className="mb-0">Total Menu</h4>
              </div>
              <div>
                <Nav.Link
                  as={Link}
                  to={"/admin/daftar-menu"}
                  className="btn btn-primary px-2 py-1 text-white"
                  style={{ fontSize: ".85rem", fontWeight: "500" }}
                >
                  Lihat Selengkapnya
                </Nav.Link>
              </div>
            </div>
            <div className="card-dashboard d-flex flex-column justify-content-center align-items-center gap-2 px-2">
              <div className="d-flex flex-column align-items-center">
                <h2>{(orderItems.length < 10 && "0") + orderItems.length}</h2>
                <h4 className="mb-0">Total Pesanan</h4>
              </div>
              <div>
                <Nav.Link
                  as={Link}
                  to={"/admin/daftar-pesanan"}
                  className="btn btn-primary px-2 py-1 text-white"
                  style={{ fontSize: ".85rem", fontWeight: "500" }}
                >
                  Lihat Selengkapnya
                </Nav.Link>
              </div>
            </div>
          </div>
          {(state.isLoading || state.isError) ? (
            <h1 className="text-center">
              {state.isLoading ? "Loading..." : "Ups! Terjadi kesalahan."}
            </h1>
          ) : (
            <div className="card bg-light-grey mt-4 me-3" style={{ width: "41.5rem" }}>
              <div className="card-body text-center py-0 px-2">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">
                        <p className="fw-semibold">No</p>
                      </th>
                      <th scope="col">
                        <p className="fw-semibold">Nama</p>
                      </th>
                      <th scope="col">
                        <p className="fw-semibold">Kategori</p>
                      </th>
                      <th scope="col">
                        <p className="fw-semibold">Harga</p>
                      </th>
                      <th scope="col">
                        <p className="fw-semibold">Deskripsi</p>
                      </th>
                    </tr>
                    {[...state.menus]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((menu, index) => (
                        <tr className="align-middle">
                          <td>
                            <p>{++index}</p>
                          </td>
                          <td>
                            <div className="d-flex align-items-center text-start">
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
                                .sort()
                                .map((category) => (
                                  category[0].toUpperCase() + category.slice(1)
                                ))
                                .join(", ")
                              }
                            </p>
                          </td>
                          <td>
                            <p style={{ width: "max-content" }}>Rp. {Number(menu.description3).toLocaleString("id-ID")},-</p>
                          </td>
                          <td>
                            <p style={{ width: "18rem", fontSize: ".85rem" }}>
                              {menu.description4.length < 125 ? menu.description4 : menu.description4.slice(0, 125) + "..."}
                            </p>
                          </td>
                        </tr>
                      ))
                    }
                  </thead>
                </table>
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="d-flex flex-column pesanan-masuk text-center">
            <h3 className="mt-3 mb-0">Pesanan Masuk</h3>
            <div className="pesanan-masuk-wrapper d-flex flex-column gap-2 my-3">
              {orderItems.length === 0 && (
                <h5 className="d-flex fw-normal px-5">
                  Belum ada Pesanan yang Masuk!
                </h5>
              )}
              {reversed
                ? [...orderItems].reverse().map(
                    (item, index) =>
                      item.status === "Pending" && (
                        <div
                          key={index}
                          className="card-pesanan-masuk d-flex flex-column mx-auto text-start"
                        >
                          <div className="d-flex">
                            <div>
                              <p
                                className="fw-semibold mb-1"
                                style={{ fontSize: "1.1rem" }}
                              >
                                Pesanan : {item.user}
                              </p>
                              <p className="fw-semibold mb-1">
                                Status : {item.status}
                              </p>
                              <p className="mb-1">
                                <Description
                                  key={index}
                                  item={item}
                                  color={"#ccc"}
                                />
                              </p>
                              {item.dataPesananUser.pesananUser
                                .slice(0, 3)
                                .map((item, index) => (
                                  <div key={index}>
                                    <p className="mb-1">
                                      <span className="fw-semibold">
                                        {item.name} x {item.quantity}{" "}
                                      </span>
                                      Rp.{" "}
                                      {Number(item.description3).toLocaleString(
                                        "id-ID"
                                      )}
                                      ,-
                                    </p>
                                  </div>
                                ))}
                              {item.dataPesananUser.pesananUser.length > 3 && (
                                <p className="fw-semibold">
                                  . . . . . . . . . .
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="btn-card-pesanan d-flex justify-content-around mt-2">
                            <div>
                              <p
                                className="btn btn-light"
                                style={{
                                  fontSize: ".85rem",
                                  cursor: "pointer",
                                  fontWeight: "500",
                                }}
                                onClick={() => setShow(index)}
                              >
                                Lihat Selengkapnya
                              </p>
                            </div>
                            <div>
                              <p
                                className="fw-semibold btn btn-dark"
                                onClick={() =>
                                  addOrderToQueueReversed(index, "Cooking")
                                }
                              >
                                ✔
                              </p>
                            </div>
                            <div>
                              <p
                                className="fw-semibold btn btn-danger"
                                onClick={() => removeOrderItemsReversed(index)}
                              >
                                X
                              </p>
                            </div>
                          </div>
                          <ModalDetailOrder
                            show={show === index}
                            handleClose={handleClose}
                            item={item}
                            index={index}
                          />
                        </div>
                      )
                  )
                : orderItems.map(
                    (item, index) =>
                      item.status === "Pending" && (
                        <div
                          key={index}
                          className="card-pesanan-masuk d-flex flex-column mx-auto text-start"
                        >
                          <div className="d-flex">
                            <div>
                              <p
                                className="fw-semibold mb-1"
                                style={{ fontSize: "1.1rem" }}
                              >
                                Pesanan : {item.user}
                              </p>
                              <p className="fw-semibold mb-1">
                                Status : {item.status}
                              </p>
                              <p className="mb-1">
                                <Description
                                  key={index}
                                  item={item}
                                  color={"#ccc"}
                                />
                              </p>
                              {item.dataPesananUser.pesananUser
                                .slice(0, 3)
                                .map((item, index) => (
                                  <div key={index}>
                                    <p className="mb-1">
                                      <span className="fw-semibold">
                                        {item.name} x {item.quantity}{" "}
                                      </span>
                                      Rp.{" "}
                                      {Number(item.description3).toLocaleString(
                                        "id-ID"
                                      )}
                                      ,-
                                    </p>
                                  </div>
                                ))}
                              {item.dataPesananUser.pesananUser.length > 3 && (
                                <p className="fw-semibold">
                                  . . . . . . . . . .
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="btn-card-pesanan d-flex justify-content-around mt-2">
                            <div>
                              <p
                                className="btn btn-light"
                                style={{
                                  fontSize: ".85rem",
                                  cursor: "pointer",
                                  fontWeight: "500",
                                }}
                                onClick={() => setShow(index)}
                              >
                                Lihat Selengkapnya
                              </p>
                            </div>
                            <div>
                              <p
                                className="fw-semibold btn btn-dark"
                                onClick={() =>
                                  addOrderToQueue(index, "Cooking")
                                }
                              >
                                ✔
                              </p>
                            </div>
                            <div>
                              <p
                                className="fw-semibold btn btn-danger"
                                onClick={() => removeOrderItems(index)}
                              >
                                X
                              </p>
                            </div>
                          </div>
                          <ModalDetailOrder
                            show={show === index}
                            handleClose={handleClose}
                            item={item}
                            index={index}
                          />
                        </div>
                      )
                  )}
            </div>
            <button
              className="btn btn-primary mt-auto mx-auto mb-3"
              style={{ width: "85%" }}
              onClick={() => addAllOrderToQueue("Cooking")}
            >
              Terima Semua Pesanan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;