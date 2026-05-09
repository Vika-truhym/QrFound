const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const Item = require('./models/Item');

// HOME PAGE
router.get('/', (req, res) => {
    res.render('index');
});

// FAQ PAGE
router.get('/faq', (req, res) => {
    res.render('faq');
});


// CREATE ITEM (FORM SUBMIT)
router.post('/create', async (req, res) => {

    const newItem = new Item(req.body);
    await newItem.save();

    // після створення — редірект на success
    res.redirect(`/success/${newItem._id}`);
});


// SUCCESS PAGE
router.get('/success/:id', async (req, res) => {

    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).send("Not found");

    const qrCode = await QRCode.toDataURL(
        `${req.protocol}://${req.get('host')}/item/${item._id}`
    );

    res.render('success', {
        item,
        qrCode
    });
});


// ITEM PAGE (після скану QR)
router.get('/item/:id', async (req, res) => {

    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).send("Item not found");

    res.render('item', { item });
});



// API 

// GET ALL (API)
router.get('/api/items', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});


// GET BY ID (API)
router.get('/api/items/:id', async (req, res) => {
    const item = await Item.findById(req.params.id);
    res.json(item);
});


// UPDATE (API)
router.put('/api/items/:id', async (req, res) => {
    const updated = await Item.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updated);
});


// DELETE (API)
router.delete('/api/items/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// GENERATE PDF
router.get('/generate_pdf/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).send("Not found");
        }

        // Генеруємо QR
        const qrUrl = `${req.protocol}://${req.get('host')}/item/${item._id}`;
        const qrImage = await QRCode.toDataURL(qrUrl);

        const doc = new PDFDocument({
            size: 'A4',
            margin: 0
        });

        res.setHeader('Content-Disposition', `attachment; filename="QR_Found_${item._id}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        const cardWidth = 312; 
        const cardHeight = 411; 
        const x = (595 - cardWidth) / 2; 
        const y = 56; 

        //Зелена рамка 
        doc
            .lineWidth(4.2) // лінія 1.5мм
            .strokeColor('#0E7156')
            .rect(x, y, cardWidth, cardHeight) // прямокутник без закруглень
            .stroke();

        //Заголовок "QR-Found"
        doc
            .fillColor('#0E7156')
            .font('Helvetica-Bold')
            .fontSize(26)
            .text('QR-Found', x, y + 34, {
                width: cardWidth,
                align: 'center'
            });

       
        // Розмір 80мм 
        const qrSize = 226;
        doc.image(qrImage, x + (cardWidth - qrSize) / 2, y + 90, {
            width: qrSize
        });

        // Назва предмету
        doc
            .fillColor('#373636')
            .font('Helvetica-Bold')
            .fontSize(18)
            .text(`Item: ${item.item_name}`, x, y + 335, {
                width: cardWidth,
                align: 'center'
            });

        // текст знизу
        doc
            .font('Helvetica-Bold')
            .fontSize(11)
            .text('SCAN TO CONTACT OWNER', x, y + 365, {
                width: cardWidth,
                align: 'center'
            });

        doc.end();
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// GENERATE PNG
router.get('/generate_png/:id', async (req, res) => {

    const item = await Item.findById(req.params.id);

    if (!item) {
        return res.status(404).send("Not found");
    }

    const qrUrl = `${req.protocol}://${req.get('host')}/item/${item._id}`;

    const qrImage = await QRCode.toBuffer(qrUrl);

    res.setHeader(
        'Content-Type',
        'image/png'
    );

    res.setHeader(
        'Content-Disposition',
        `attachment; filename=QR_Found_${item._id}.png`
    );

    res.send(qrImage);
});


// 404
router.use((req, res) => {
    res.status(404).send("Page not found");
});


module.exports = router;