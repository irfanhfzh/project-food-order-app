import { Col, Container, Row } from "react-bootstrap";
import SpecialGreen from "../../assets/images/spesial_hijau.png";
import SpecialYellowImg from "../../assets/images/spesial_kuning-img.png";
import SpecialYellow from "../../assets/images/spesial_kuning.png";
import SpecialRedImg from "../../assets/images/spesial_merah-img.png";
import SpecialRed from "../../assets/images/spesial_merah.png";
import "../style/HomeSectionSpecial.css";

const Special = () => {
	return (
		<div className="special-section">
			<Container>
				<Row className="wrapper-special-content">
					<Col className="d-flex special-content-1">
						<img src={SpecialGreen} alt="Spesial Nasi Goreng" />
					</Col>
					<Col className="d-flex flex-column justify-content-between gap-4 special-content-2">
						<div className="position-relative d-flex justify-content-center">
							<img src={SpecialYellow} alt="Kami Mendatar di Bekasi" />
							<div
								className="position-absolute bekasi"
								style={{ right: "3px", bottom: "-2px" }}
							>
								<img
									src={SpecialYellowImg}
									alt="LandMark Bekasi"
									style={{ width: "17rem" }}
								/>
							</div>
						</div>
						<div className="position-relative d-flex justify-content-center">
							<img src={SpecialRed} alt="Spesial Gratis Ongkos Kirim" />
							<div
								className="position-absolute kirim"
								style={{ right: "-15px", bottom: "-2px" }}
							>
								<img src={SpecialRedImg} alt="Gratis Ongkos Kirim" />
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Special;
