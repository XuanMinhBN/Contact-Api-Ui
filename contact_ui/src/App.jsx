import {useEffect, useState} from "react";
import {getContacts} from "./api/ContactService.jsx";
import Header from "./components/Header.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import ContactList from "./components/ContactList.jsx";

function App() {
    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState(0);

    const getAllContacts = async (page = 0, size = 10) => {
        try{
            setCurrentPage(page);
            const {data} = await getContacts(page, size);
            setData(data);
            console.log(data);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        getAllContacts();
    }, []);

    const toogleModal = (show) => {
        console.log("I was clicked!");
    }

  return (
    <>
      <Header toogleModal={toogleModal} nbOfContacts={data.totalElements} />
        <main className="main">
            <div className="container">
                <Routes>
                    <Route path="/" element={ <Navigate to={'/contacts'} />} />
                    <Route path="/contacts" element={<ContactList data={data} currentPage={currentPage} getAllContacts={getAllContacts} />} />
                </Routes>
            </div>
        </main>
    </>
  );
}

export default App
