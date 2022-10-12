import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { setOrderItems } from "../bootstrap/actions";
import Description from "./Description";
import MenuOrderLess from "./MenuOrderLess";

const ModalEditDetailOrder = ({ showEdit, handleCloseEdit, item, index }) => {
  const { orderItems } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [editStatus, setEditStatus] = useState("");

  const editDetailOrder = () => {
    console.log(editStatus);
    dispatch(
      setOrderItems(
        orderItems.map((itemData, i) =>
          i === index ? (itemData.status = editStatus) : itemData
        )
      )
    );
    dispatch(setOrderItems(orderItems));
    handleCloseEdit();
    swal({
      title: "Sukses Menerima Pesanan!",
      text: "Pesanan " + item.user + " sudah diterima",
      icon: "success",
      button: false,
      timer: 1750,
    });
  };

  const handleChangeStatus = (e) => {
    setEditStatus(e.target.value);
  };

  return (
    <>
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0">Edit Pesanan</p>
          </Modal.Title>
        </Modal.Header>
        <div
          key={index}
          className="d-flex justify-content-between align-items-center p-4"
          style={{
            width: "43rem",
            padding: ".75rem",
          }}
        >
          <div>
            <p style={{ fontSize: "1.15rem", fontWeight: "600" }}>
              Pesanan : {item.user}
            </p>
            <MenuOrderLess key={index} item={item} />
          </div>
          <div style={{ width: "17rem" }}>
            <p style={{ fontSize: ".85rem", fontWeight: "600" }}>
              {item.dateTime}
            </p>
            <div
              className="d-flex align-items-center mb-2"
              style={{ height: "40px" }}
            >
              <p className="fw-semibold mb-0 me-3">Status : </p>
              <select
                className="form-select form-select-sm"
                aria-label=".form-select-sm example"
                style={{ width: "max-content" }}
                defaultValue={item.status}
                onChange={handleChangeStatus}
              >
                <option value={"Cooking"}>Cooking</option>
                <option value={"Deliver"}>Deliver</option>
                <option value={"Done"}>Done</option>
              </select>
            </div>
            <p>
              <Description key={index} item={item} color={"#333"} />
            </p>
            <p style={{ fontSize: "1.15rem", fontWeight: "600" }}>
              Total Harga : Rp.
              {item.dataPesananUser.totalHargaPesanan.toLocaleString("id-ID")}
              ,-
            </p>
          </div>
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="primary" onClick={editDetailOrder}>
            Simpan Perubahan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalEditDetailOrder;
