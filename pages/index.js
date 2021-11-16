import Head from "next/head";
import Image from "next/image";
import AuthForm from "../components/Auth/Auth";

// import AuthForm from "../../containers/Auth/Auth.js";

import classes from "./index.module.scss";

const icons_01 = "/icons/icons-01.png";
const icons_02 = "/icons/icons-02.png";
const icons_03 = "/icons/icons-03.png";
const icons_04 = "/icons/icons-04.png";
const icons_05 = "/icons/icons-05.png";

const Home = () => {
	return (
		<>
			<Head>
				<title>CrewFinder</title>
			</Head>

			<div className={classes.LoginMain}>
				<div className={classes.Login}>
					<AuthForm />
				</div>
				<div className={classes.LoginStaticContent}>
					<div className={classes.LoginStaticContent__Main}>
						<h2 className="center-title bottom-line">
							Mire képes a Crew Finder!
						</h2>
						<div className={classes.LoginStaticContent__Main_Flex}>
							<div className={classes.LoginStaticContent__Main_Pix}>
								<Image
									src={icons_01}
									alt="icons01"
									layout="fill"
									objectFit={"contain"}
									priority
									blurDataURL
								/>
							</div>
							<div className={classes.LoginStaticContent__Main_Item}>
								<h3>Találj munkát gyorsan és egyszerűen</h3>
								<p>Találd meg a helyed a stábban gyorsan és egyszerűen</p>
							</div>
						</div>
						<div className={classes.LoginStaticContent__Main_Flex}>
							<div className={classes.LoginStaticContent__Main_Pix}>
								<Image
									src={icons_02}
									alt="icons02"
									layout="fill"
									objectFit={"contain"}
									blurDataURL
								/>
							</div>
							<div className={classes.LoginStaticContent__Main_Item}>
								<div>
									<h3>Tervezd a kapacitásod</h3>
									<p>
										Tervezd és kövesd filmes felkéréseidet és beosztásodat egy
										helyen...
									</p>
								</div>
							</div>
						</div>
						<div className={classes.LoginStaticContent__Main_Flex}>
							<div className={classes.LoginStaticContent__Main_Pix}>
								<Image
									src={icons_03}
									alt="icons03"
									layout="fill"
									objectFit={"contain"}
									blurDataURL
								/>
							</div>
							<div className={classes.LoginStaticContent__Main_Item}>
								<div>
									<h3>Pont akire szükséged van</h3>
									<p>
										Segítünk, hogy munkaadóként a tapasztalatok és készségek
										alapján a számodra legmegfelelőbb emberekkel dolgozhass
										együtt minden forgatáson
									</p>
								</div>
							</div>
						</div>
						<div className={classes.LoginStaticContent__Main_Flex}>
							<div className={classes.LoginStaticContent__Main_Pix}>
								<Image
									src={icons_04}
									alt="icons04"
									layout="fill"
									objectFit={"contain"}
									blurDataURL
								/>
							</div>
							<div className={classes.LoginStaticContent__Main_Item}>
								<div>
									<h3>Kövesd projekted alakulását valós időben.</h3>
									<p>
										Munkaadóként valós időben értesülsz és kezelheted a
										jelentkezéseket meghirdetett pozícióidra{" "}
									</p>
								</div>
							</div>
						</div>
						<div className={classes.LoginStaticContent__Main_Flex}>
							<div className={classes.LoginStaticContent__Main_Pix}>
								<Image
									src={icons_05}
									alt="icons05"
									layout="fill"
									objectFit={"contain"}
									blurDataURL
								/>
							</div>
							<div className={classes.LoginStaticContent__Main_Item}>
								<div>
									<h3>Építs csapatot egyszerűen</h3>
									<p>
										Érd el könnyen és gyorsan a kedvenc kollégáidat vagy dolgozz
										együtt új szakemberekkel
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
