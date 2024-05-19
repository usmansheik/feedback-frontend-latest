import AdminFeedback from "../components/AdminFeedback";
import ViewProducts from "../components/ViewProducts";
import {useEffect} from "react";


function Dashboard (){

    return localStorage.getItem("role") === "admin" ? (
        <AdminFeedback />
    ) : (
        <ViewProducts />
    )
}

export default Dashboard;