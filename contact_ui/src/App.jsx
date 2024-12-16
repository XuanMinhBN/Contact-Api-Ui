import {useEffect, useRef, useState} from "react";
import 'react-toastify/dist/ReactToastify.css'
import {editContact, getContacts, saveContacts, updatePhoto} from "./api/ContactService.jsx";
import Header from "./components/Header.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import ContactList from "./components/ContactList.jsx";
import ContactDetail from "./components/ContactDetail.jsx";
import {toastError} from "./api/ToastService.jsx";
import {ToastContainer} from "react-toastify";

function App() {
    const modelRef = useRef();
    const fileRef = useRef();
    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [file, setFile] = useState(undefined);
    const [values, setValues] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
    });

    const getAllContacts = async (page = 0, size = 10) => {
        try{
            setCurrentPage(page);
            const {data} = await getContacts(page, size);
            setData(data);
            console.log(data);
        }catch(error){
            console.log(error);
            toastError(error.message);
        }
    }

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    }

    const handleNewContact = async (event) => {
        event.preventDefault();
        try{
            const {data} = await saveContacts(values);
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('id', data.id);
            const {data: photoUrl} = await updatePhoto(formData);
            toggleModal(false);
            setFile(undefined);
            fileRef.current.value = null;
            setValues({
                name: '',
                email: '',
                phone: '',
                address: '',
                title: '',
                status: '',
            });
            getAllContacts();
        }catch(error){
            console.log(error);
            toastError(error.message);
        }
    }

    const updateContact = async (contact) => {
        try{
           const {data} = await editContact(contact);
           console.log(data);
        }catch(error){
            console.log(error);
            toastError(error.message);
        }
    }

    const updateImage = async (formData) => {
      try{
          const {data: photoUrl} = await updatePhoto(formData);
      }catch(error){
          console.log(error);
          toastError(error.message);
      }
    };

    const toggleModal = (show) => {
        show ? modelRef.current.showModal() : modelRef.current.close();
    }

    useEffect(() => {
        getAllContacts();
    }, []);

  return (
    <>
      <Header toggleModal={toggleModal} nbOfContacts={data.totalElements} />
        <main className="main">
            <div className="container">
                <Routes>
                    <Route path="/" element={ <Navigate to={'/contacts'} />} />
                    <Route path="/contacts" element={<ContactList data={data} currentPage={currentPage} getAllContacts={getAllContacts} />} />
                    <Route path="/contacts/:id" element={<ContactDetail updateContact={updateContact} updateImage={updateImage}/>}/>
                </Routes>
            </div>
        </main>

        {/* Modal */}
        <dialog ref={modelRef} className="modal" id="modal">
            <div className="modal__header">
                <h3>New Contact</h3>
                <i className="bi bi-x-lg" onClick={() => toggleModal(false)}></i>
            </div>
            <div className="divider"></div>
            <div className="modal__body">
                <form onSubmit={handleNewContact}>
                    <div className="user-details">
                        <div className="input-box">
                            <span className="details">Name</span>
                            <input type="text" value={values.name} onChange={onChange} name="name" required/>
                        </div>
                        <div className="input-box">
                            <span className="details">Email</span>
                            <input type="text" value={values.email} onChange={onChange} name="email" required/>
                        </div>
                        <div className="input-box">
                            <span className="details">Title</span>
                            <input type="text" value={values.title} onChange={onChange} name="title" required/>
                        </div>
                        <div className="input-box">
                            <span className="details">Phone Number</span>
                            <input type="text" value={values.phone} onChange={onChange} name="phone" required/>
                        </div>
                        <div className="input-box">
                            <span className="details">Address</span>
                            <input type="text" value={values.address} onChange={onChange} name="address" required/>
                        </div>
                        <div className="input-box">
                            <span className="details">Account Status</span>
                            <input type="text" value={values.status} onChange={onChange} name="status" required/>
                        </div>
                        <div className="file-input">
                            <span className="details">Profile Photo</span>
                            <input type="file" ref={fileRef} onChange={(event) => setFile(event.target.files[0])} name="photo" required/>
                        </div>
                    </div>
                    <div className="form_footer">
                        <button type="button" className="btn btn-danger" onClick={() => toggleModal(false)}>Cancel</button>
                        <button type="submit" className="btn">Save</button>
                    </div>
                </form>
            </div>
        </dialog>
        <ToastContainer/>
    </>
  );
}

export default App
