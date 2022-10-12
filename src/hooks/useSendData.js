import api, { imageServer } from "../bootstrap/apis"

const saveImageToServer = async (formData) => {
  try {
    const result = await imageServer.post("/", formData)
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data.data || ""
  } catch (error) {
    throw error
  }
}

const saveDataToKawahServer = async (state, action, uploadedImageURL, access_token) => {
  try {
    if (action === "ADD_MENU" || action === "EDIT_MENU") {
      const url = `/content/${action === "ADD_MENU" ? "create" : `update/${state.formData.id}`}`
      const method = action === "ADD_MENU" ? "post" : "put"

      const result = await api[method](url, {
        name: state.formData.nama,
        image: uploadedImageURL,
        description1: state.formData.slug,
        description2: JSON.stringify(state.formData.kategori),
        description3: state.formData.harga,
        description4: state.formData.deskripsi
      }, { headers: { access_token } })

      return result.data
    } else if (action === "DELETE_MENU") {
      const url = `/content/delete/${state.formData.id}`
      
      const result = await api.delete(url, {
        headers: { access_token }
      })

      return result.data
    } else {
      throw new Error("Action tidak ditemukan.")
    }
  } catch (error) {
    throw error
  }
}

export const useSendData = () => {
  return async (state, action, access_token) => {
    const formData = new FormData()
    formData.append("submit", "true")
    formData.append("slug", state.formData.slug)
    if (action === "EDIT_MENU") {
      formData.append("oldSlug", state.formData.oldSlug)
      formData.append("edit", "true")
    }
    if (action === "DELETE_MENU") formData.append("delete", "true")
    if (state.croppedImage) formData.append("image", state.croppedImage)
    try {
      const uploadedImageURL = await saveImageToServer(formData)
      const mainServerResult = await saveDataToKawahServer(state, action, uploadedImageURL, access_token)
      return mainServerResult
    } catch (error) {
      throw error
    }
  }
}
