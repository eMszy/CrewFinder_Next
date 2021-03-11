import Head from "next/head";
import Image from "next/image";
import React from "react";
import classes from "./Rolunk.module.scss";

const Rolunk_Vilonya = "/pictures/Rolunk_Vilonya.jpg";
const Rolunk_Boza = "/pictures/Rolunk_Boza.jpg";

const Rolunk = () => (
	<>
		<Head>
			<title>CrewFinder - Rólunk</title>
		</Head>
		<div className={classes.content}>
			<div className={classes.Content_Height}>
				<h1>Crew Finder</h1>
				<p className={classes.alignleft}>
					A CrewFinder létrejöttének célja, hogy a filmipar résztvevői számára
					segítséget nyújtson a legprofibb, szabad szakemberek megtalálásában,
					mely tapasztalatink szerint nehézkes és időigényes folyamat.
					Szerencsére a filmgyártás az elmúlt időszakban csúcson pörög
					Magyarországon is. Ennek azonban velejárója, hogy rengeteg új ember
					kerül be a szakmánkba és új nyitott pozíciók jelennek meg egyik napról
					a másikra, hisz, mint tudjuk, a filmezésben egy állandó van, az pedig
					a változás.
				</p>
				<p className={classes.alignleft}>
					A CrewFinder segítségével azonnal tudsz reagálni a produkciók
					igényeire, legyél akár stábtag kereső vagy stábtag. Szándékunk, hogy
					megkönnyítsük és felgyorsítsuk a folyamatot, amelyben létrejöhet egy
					stáb vagy betöltődhet egy beugrós pozíció.
				</p>
				<p className={classes.alignleft}>Íme néhány szó rólunk:</p>
			</div>
			<hr />
			<div className={classes.Content_Height}>
				<h2 className={classes.alignright}>Vilonya Norbert</h2>
				<div>
					<figure className={classes.imgRight}>
						<Image
							src={Rolunk_Vilonya}
							alt="Vilonya Norbert"
							width={190}
							height={190}
						/>
					</figure>
				</div>
				<p className={classes.alignleft}>
					Filmes pályafutásomat 2005-ben kezdtem, Set PA-ként. Az évek során,
					végigjártam a ranglétrát, és 2012-től már 2nd AD, illetve 1st AD-ként
					dolgoztam. Az elmúlt 14 évben volt szerencsém olyan produkciókban
					dolgozni, mint például The Terror, Force 2, Spy, Hercules, 47 Ronin,
					The Borgias.
				</p>
				<p className={classes.alignleft}>
					Tapasztalatból tudom, hogy olykor milyen nehéz lehet a megfelelő
					munkatársak megtalálása, illetve, hogy mennyire időigényes is egy
					kompakt, jól működő stáb összeállítása, ezért döntöttem úgy, hogy
					belevágok egy olyan projektbe, amely megoldás nyújthat erre a
					problémára.
				</p>
			</div>
			<hr />
			<div className={classes.Content_Height}>
				<h2 className={classes.alignleft}>Boza András</h2>
				<div>
					<figure className={classes.imgLeft}>
						<Image
							src={Rolunk_Boza}
							alt="Boza András"
							width={190}
							height={190}
						/>
					</figure>
				</div>
				<p className={classes.alignright}>
					Az évek során számos remek produkcióban volt lehetőségem dolgozni,
					többek közt az OTW, Ransom, The Terror vagy éppen a Genius Picasso.
					Ezeknek is köszönhetem azt a tapasztalatot, amit az elmúlt 7 évben
					szereztem. Jelenleg 2nd és 1st AD-ként dolgozom.
				</p>
				<p className={classes.alignright}>
					Volt lehetőségem bepillantást nyerni, hogy mire vagy kire van szüksége
					a stábtagoknak, produkciónak és hogy ezek milyen nehezen találkoznak.
					Elhatároztam, hogy létrehozunk egy rendszert, mely segít ennek
					megvalósulásában! Rengeteg tervünk és ötletünk van még a jövőre nézve,
					hiszen Magyarország mára nem csak kiváló kiszolgáló személyzetet képes
					adni a külföldi produkciók számára, hanem nívós magyar filmeket és
					díjakat is tudhatunk a magunkénak.
				</p>
			</div>
		</div>
	</>
);

export default Rolunk;
