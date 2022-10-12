import { Button, Col, Form, InputGroup, Modal, Row, Image } from "react-bootstrap"
import { memo, useState } from "react"
import { useSelector } from "react-redux"
import { useSendData } from "../hooks/useSendData"
import { produce } from "immer"
import defaultImage from "../assets/images/menu_default_image.png"
import loadingImage from "../assets/images/loading.gif"

const initialFormDataValue = {
  id: "",
  oldSlug: "",
  slug: "",
  nama: "",
  harga: "",
  deskripsi: "",
  kategori: [],
  imageURL: ""
}

const initialStateValue = {
  action: "",
  formData: initialFormDataValue,
  formError: {},
  isLoading: false,
  previewImage: "",
  croppedImage: null
}

const MenuModal = memo(({ action, menu, showModal, onModalToggle, reloadPage }) => {
  const { access_token, categories } = useSelector((state) => state)
  const sendData = useSendData()
  const [state, setState] = useState({ ...initialStateValue })

  const handleFillForm = () => {
    setState(
      produce((draft) => {
        if (menu) {
          draft.formData.id = menu.id
          draft.formData.oldSlug = menu.description1
          draft.formData.slug = menu.description1
          draft.formData.nama = menu.name
          draft.formData.imageURL = menu.image
          draft.formData.harga = menu.description3
          draft.formData.kategori = JSON.parse(menu.description2)
          draft.formData.deskripsi = menu.description4
        }
        draft.action = action
      })
    )
  }

  const handleClearForm = () => {
    setState(produce((draft) => initialStateValue))
  }

  const handleInputChange = ({ target }) => {
    if (target.type === "checkbox") {
      const isCategoryAlreadyInState = state.formData.kategori.includes(target.id.toLowerCase())
      if (target.checked && !isCategoryAlreadyInState) {
        setState(
          produce((draft) => {
            draft.formData.kategori.push(target.id.toLowerCase())
            draft.formError = {}
          })
        )
      } else {
        setState(
          produce((draft) => {
            const index = draft.formData.kategori.indexOf(target.id.toLowerCase())
            draft.formData.kategori.splice(index, 1)
          })
        )
      }
    } else {
      setState(
        produce((draft) => {
          if (target.name === "nama") {
            draft.formData.slug = target.value.toLowerCase().replaceAll(" ", "-")
          }
          draft.formData[target.name] = target.value
        })
      )
    }
  }

  const handleImageFormChange = ({ target }) => {
    if (target.files[0]) {
      setState(
        produce((draft) => {
          draft.previewImage = URL.createObjectURL(target.files[0])
        })
      )
    } else {
      setState(
        produce((draft) => {
          draft.formData.imageURL = ""
          draft.previewImage = ""
        })
      )
    }
  }

  const cropImage = () => {
    if (state.previewImage) {
      /* Elemen gambar yang akan diubah */
      const imageElement = document.createElement("img")
      imageElement.onload = async () => {
        /* Menyiapkan canvas untuk menggambar elemen gambar */
        const imgCanvas = document.createElement("canvas")
        const imgContext = imgCanvas.getContext("2d")

        /* Menyiapkan ukuran dan posisi crop */
        let cropStartPositionX = 0
        let cropWidthSize = 0
        let cropStartPositionY = 0
        let cropHeightSize = 0
        
        /* Mengambil bagian tengah gambar */
        if (imageElement.width <= imageElement.height) {
          cropWidthSize = imageElement.width
          cropHeightSize = Math.trunc(imageElement.width * 0.75075075075)
          cropStartPositionY = Math.trunc((imageElement.height - cropHeightSize) / 2)
        } else {
          cropHeightSize = imageElement.height
          cropWidthSize = Math.trunc(imageElement.height * 1.332)
          cropStartPositionX = Math.trunc((imageElement.width - cropWidthSize) / 2)
        }

        /* Menyamakan ukuran canvas dengan ukuran crop */
        imgCanvas.width = cropWidthSize
        imgCanvas.height = cropHeightSize
        
        /* Gambar elemen gambar ke dalam canvas */
        imgContext.drawImage(
          imageElement,
          cropStartPositionX,
          cropStartPositionY,
          cropWidthSize,
          cropHeightSize,
          0,
          0,
          cropWidthSize,
          cropHeightSize
        )

        /* Ubah konten canvas menjadi data URL (string) */
        const imgAsDataURL = imgCanvas.toDataURL("image/jpeg")

        /* Ubah data URL menjadi data blob lalu menjadi file untuk dikirim */
        const blob = await (await fetch(imgAsDataURL)).blob()
        const file = new File(
          [blob],
          document.querySelector("[type='file']").files[0].name,
          { type: blob.type }
        )

        setState(
          produce((draft) => {
            draft.croppedImage = file
          })
        )
      }

      imageElement.src = URL.createObjectURL(
        document.querySelector("[type='file']").files[0]
      )
    } else {
      setState(
        produce((draft) => {
          draft.croppedImage = null
        })
      )
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    switch (state.action) {
      case "DELETE_MENU":
        sendData(state, state.action, access_token)
          .then((result) => {
            alert(result.message)
          })
          .catch((error) => console.log(error))
          .finally(() => {
            setState(
              produce((draft) => { draft.isLoading = false })
            )
            onModalToggle()
            reloadPage((prev) => ++prev)
          })
        setState(
          produce((draft) => { draft.isLoading = true })
        )
        break
      default:
        if (state.formData.kategori.length > 0) {
          sendData(state, state.action, access_token)
            .then((result) => {
              alert(result.message)
            })
            .catch((error) => console.log(error))
            .finally(() => {
              setState(
                produce((draft) => { draft.isLoading = false })
              )
              onModalToggle()
              reloadPage((prev) => ++prev)
            })
          setState(
            produce((draft) => ({ ...initialStateValue, isLoading: true }))
          )
          document.querySelectorAll("[type='checkbox']").forEach((el) => el.checked = false)
          document.querySelector("[type='file']").value = null
        } else {
          setState(
            produce((draft) => {
              draft.formError.checkbox = "pilih salah satu kategori"
            })
          )
          document.querySelector("[type='checkbox']").focus()
        }
    }
  }

  return (
    <Modal
      size="lg"
      show={showModal}
      onShow={handleFillForm}
      onHide={onModalToggle}
      onExited={handleClearForm}
    >
      <Form
        id="menuForm"
        onSubmit={handleFormSubmit}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {state.action === "DELETE_MENU" ?
              "Hapus Menu"
              : state.action === "ADD_MENU" ? "Tambah Menu" : "Edit Menu"
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {state.action === "DELETE_MENU" ? (
            <p>Yakin ingin menghapus <b>{state.formData.nama}</b> ?</p>
          ) : (
            <>
              <Form.Group
                className="mb-3"
                controlId="menuForm.Nama"
              >
                <Form.Label>Nama*</Form.Label>
                <Form.Control
                  required
                  name="nama"
                  type="text"
                  value={state.formData.nama}
                  onChange={handleInputChange}
                  autoFocus
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="menuForm.Harga"
              >
                <Form.Label>Harga*</Form.Label>
                <InputGroup>
                  <InputGroup.Text>Rp</InputGroup.Text>
                  <Form.Control
                    required
                    name="harga"
                    type="number"
                    min="1"
                    value={state.formData.harga}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="menuForm.Deskripsi"
              >
                <Form.Label>Deskripsi*</Form.Label>
                <Form.Control
                  required
                  name="deskripsi"
                  as="textarea"
                  rows="3"
                  value={state.formData.deskripsi}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="menuForm.Kategori"
              >
                <Form.Label>Kategori*</Form.Label>
                <Row>
                  {categories.map((category, index) => {
                    if (category === "Semua") {
                      return null
                    }
                    return (
                      <Col key={index}>
                        <Form.Check
                          type="checkbox"
                          name="kategori"
                          id={category}
                          label={category}
                          checked={state.formData.kategori.includes(category.toLowerCase())}
                          isInvalid={state.formError.checkbox}
                          onChange={handleInputChange}
                        />
                      </Col>
                    )
                  })}
                </Row>
                {(state.formError.checkbox) && <small className="text-danger">{state.formError.checkbox}</small>}
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="menuForm.Gambar"
              >
                <Form.Label>Gambar</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/jpg"
                  onChange={handleImageFormChange}
                />
              </Form.Group>
              <Row className="mb-3">
                <Col xs={12}><Form.Label>Preview</Form.Label></Col>
                <Col>
                  <div style={{ maxWidth: '333px', maxHeight: '250px' }}>
                    <div
                      style={{
                        position: 'relative',
                        height: '0',
                        paddingBottom: '75.075075075%'
                      }}
                    >
                      <Image
                        id="previewImage"
                        src={state.previewImage || state.formData.imageURL || defaultImage}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                        fluid
                        onLoad={cropImage}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <small>* Wajib diisi.</small>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {state.isLoading &&
            <Image
              style={{ width: "2rem" }}
              src={loadingImage}
              alt="Saving..."
              fluid
            />
          }
          <Button variant="secondary" onClick={onModalToggle}>Batal</Button>
          <Button type="submit" variant="primary">
            {state.action === "DELETE_MENU" ? "Yakin" : "Simpan"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
})

export default MenuModal