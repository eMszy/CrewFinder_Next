import Head from "next/head";
import React from "react";
import classes from "./Ismerteto.module.scss";

const Ismerteto = () => (
	<>
		<Head>
			<title>CrewFinder - Ismertető</title>
		</Head>
		<div className={classes.content}>
			<h1>Kedves Érdeklődők!</h1>
			<p>
				A CrewFindert azért hoztuk létre, hogy a filmiparban könnyen tudjon
				találkozni az, aki dolgozni szeretne azzal, aki embert keres.
				Tapasztalataink szerint, főként a „filmes csúcsidőszakban”, meglehetősen
				nehéz megtalálni a szabad és jó munkaerőt a piacon. A CrewFinder
				használatával ez a folyamat egyszerű és gyors.
			</p>
			<p>
				A rendszerünk alapvetően két nagy részre oszlik. Az első a
				„Stábtagok”-é, ők azok, akik munkát szeretnének találni valamelyik
				produkcióban. A másik a felület azoknak szól, akik „Stábtagot keresnek”.
				Ők klasszikusan a részlegvezetők, best boy-ok, akiknek nap, mint nap az
				a dolga, hogy a szabad pozíciókra megtalálják a megfelelő, szabad
				munkaerőt.
			</p>
			<p>
				Meglátásunk szerint e két szerep nem különválasztható, tehát aki ma
				stábtagot keres, az másnap könnyen lehet, hogy stábtag lesz, így őt
				érdeklik a szabad pozíciók.
			</p>
			<p>
				Regisztrációnál minden felhasználó alapértelmezettként „Stábtag” lesz,
				ha azonban Te emellett stábtagot is keresel, akkor belépés után létre
				kell hoznod egy „Stábtag kereső” profilt is. Ez után ezen a felületen
				fogsz tudni munkákat létrehozni, pozíciókat meghirdetni, munkaerőt
				keresni és lefoglalni.
			</p>
			<p>
				A CrewFinder használata teljesen ingyenes az első időszakban, hisz
				tudjuk, a rendszer nem hibátlan még, szeretnénk a Ti igényeitek alapján
				a végleges verziót megfejleszteni. A fejlesztési időszak lezárultával a
				regisztráció továbbra is ingyenes marad, tehát a „Stábtag” felület
				mindenki számára költségmentesen elérhető, azonban szándékaink szerint a
				„Stábtag keresési” funkció költségtérítés ellenében lesz elérhető.
			</p>
			<p>
				Ahogy említettük a CrewFinder frissen bevezetett rendszerként
				tesztverzióban fut. A rendszer még nem tökéletes, ahhoz azonban, hogy
				azzá váljon a Ti segítségetekre is szükségünk van. Örömmel veszünk
				minden kommentet, javaslatot a rendszer működésével kapcsolatban az{" "}
				<a href="mailto:info@crewfinder.hu" target="blank">
					info@crewfinder.hu
				</a>{" "}
				e-mail címen.
			</p>
			<p>
				Reméljük Téged is hamarosan az aktív felhasználóink között
				üdvözölhetünk!
			</p>
		</div>
	</>
);

export default Ismerteto;
