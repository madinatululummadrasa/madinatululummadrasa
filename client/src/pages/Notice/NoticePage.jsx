import Breadcrumb from "../../components/Shared/Breadcrumb/Breadcrumb";
import Container from "../../components/Shared/Container";
import NoticeTable from "./Component/NoticeTable";


const NoticePage = () => {
    return (
       <Container>
        <Breadcrumb></Breadcrumb>
        <NoticeTable></NoticeTable>
       </Container>
    );
};

export default NoticePage;