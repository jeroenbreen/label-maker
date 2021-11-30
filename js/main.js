const page = {
    margin: {
        left: 0,
        top: 0
    },
    width: 210,
    height: 297
}

const settings = {
    showBoxes: true
}

const label = {
    width: 70,
    height: 37,
    padding: {
        left: 5,
        top: 10
    },
}

const getDocument = (addresses) => {
    const doc = new jspdf.jsPDF();
    doc.setFontSize(11);
    const cursor = {
        left: page.margin.left,
        top: page.margin.top
    }
    for (const address of addresses) {
        addAddress(doc, address, cursor);
        cursor.left += label.width;
        if (cursor.left > page.width - label.width - page.margin.left) {
            cursor.left = page.margin.left;
            cursor.top += label.height;
        }
        if (cursor.top > page.height - label.height- page.margin.top) {
            doc.addPage();
            cursor.left = page.margin.left;
            cursor.top = page.margin.top;
        }
    }


    return doc;
}

const addAddress = (doc, address, cursor) => {
    const lineheight = 5;
    const name = address[0];
    const street = address[1];
    const postcode = address[2] + " " + address[3];
    const items = [name, street, postcode];
    const x = cursor.left + label.padding.left;
    let y = cursor.top + label.padding.top - lineheight;
    for (const item of items) {
        const set = doc.splitTextToSize(item, label.width - 2 * label.padding.left);
        for (const item of set) {
            doc.text(item, x, y += lineheight, address.name);
        }
    }
    if (settings.showBoxes) {
        doc.rect(
            cursor.left,
            cursor.top,
            label.width,
            label.height,
        );
    }
}



const reqListener = (response) => {
    const text = response.target.response;
    csv({
        output: "csv"
    })
        .fromString(text)
        .then((addresses)=>{
            const doc = getDocument(addresses);
            doc.save();
        });
}

const req = new XMLHttpRequest();
req.addEventListener("load", reqListener);
req.open("get", "source/adressen.csv", true);
req.send();



