class EbookGenerator {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.currentEbook = null;
        this.paymentCompleted = false;
    }

    initializeElements() {
        this.titleInput = document.getElementById('ebook-title');
        this.charCount = document.getElementById('char-count');
        this.genreSelect = document.getElementById('genre');
        this.coverStyleSelect = document.getElementById('cover-style');
        this.coverColorSelect = document.getElementById('cover-color');
        this.generateBtn = document.getElementById('generate-btn');
        this.btnText = this.generateBtn.querySelector('.btn-text');
        this.btnLoader = this.generateBtn.querySelector('.btn-loader');
        
        this.generatorSection = document.querySelector('.generator-section');
        this.paymentSection = document.getElementById('payment-section');
        this.resultSection = document.getElementById('result-section');
        
        // Éléments de paiement MoMo
        this.emailInput = document.getElementById('email');
        this.phoneNumberInput = document.getElementById('phone-number');
        this.paymentForm = document.getElementById('payment-form');
        this.submitPaymentBtn = document.getElementById('submit-payment');
        this.paymentErrors = document.getElementById('payment-errors');
        
        // Éléments de récapitulatif
        this.summaryTitle = document.getElementById('summary-title');
        this.summaryGenre = document.getElementById('summary-genre');
        this.summaryLength = document.getElementById('summary-length');
        this.summaryCover = document.getElementById('summary-cover');
        
        // Canvas pour la couverture
        this.coverCanvas = document.getElementById('cover-canvas');
    }

    attachEventListeners() {
        this.titleInput.addEventListener('input', () => this.handleTitleInput());
        this.generateBtn.addEventListener('click', () => this.generateEbookFree());
        
        // Événements de paiement MoMo (gardés pour la version payante)
        this.paymentForm.addEventListener('submit', (e) => this.handlePayment(e));
        document.getElementById('back-to-form').addEventListener('click', () => this.backToForm());
        
        // Événements de téléchargement
        document.getElementById('download-pdf').addEventListener('click', () => this.downloadEbook('pdf'));
        document.getElementById('download-epub').addEventListener('click', () => this.downloadEbook('epub'));
        document.getElementById('download-txt').addEventListener('click', () => this.downloadEbook('txt'));
        document.getElementById('download-cover').addEventListener('click', () => this.downloadCover());
        document.getElementById('new-ebook-btn').addEventListener('click', () => this.resetForm());
    }

    handleTitleInput() {
        const title = this.titleInput.value.trim();
        this.charCount.textContent = title.length;
        this.generateBtn.disabled = title.length === 0;
    }

    generateEbookFree() {
        const title = this.titleInput.value.trim();
        const genre = this.genreSelect.value;
        const length = this.lengthSelect.value;
        const tone = this.toneSelect.value;
        const coverStyle = this.coverStyleSelect.value;
        const coverColor = this.coverColorSelect.value;

        if (!title) return;

        this.showLoading(true);

        try {
            // Simuler la génération de contenu
            this.simulateGeneration().then(() => {
                // Générer le contenu de l'ebook
                this.currentEbook = this.createEbookContent(title, genre, length, tone);
                this.currentEbook.coverStyle = coverStyle;
                this.currentEbook.coverColor = coverColor;
                
                // Générer la couverture
                this.generateCover();
                
                // Afficher les résultats
                this.displayResults();
                
                this.showLoading(false);
            });
            
        } catch (error) {
            console.error('Erreur lors de la génération:', error);
            this.showError('Une erreur est survenue lors de la génération de l\'ebook.');
            this.showLoading(false);
        }
    }

    showPaymentSection() {
        const title = this.titleInput.value.trim();
        const genre = this.genreSelect.options[this.genreSelect.selectedIndex].text;
        const length = this.lengthSelect.options[this.lengthSelect.selectedIndex].text;
        const coverStyle = this.coverStyleSelect.options[this.coverStyleSelect.selectedIndex].text;

        if (!title) return;

        // Remplir le récapitulatif
        this.summaryTitle.textContent = title;
        this.summaryGenre.textContent = genre;
        this.summaryLength.textContent = length;
        this.summaryCover.textContent = coverStyle;

        // Afficher la section de paiement
        this.generatorSection.style.display = 'none';
        this.paymentSection.style.display = 'block';
    }

    async handlePayment(event) {
        event.preventDefault();
        
        const email = this.emailInput.value;
        const phoneNumber = this.phoneNumberInput.value;
        const selectedProvider = document.querySelector('input[name="momo-provider"]:checked').value;
        
        if (!email) {
            this.showPaymentError('Veuillez entrer une adresse email valide');
            return;
        }
        
        if (!phoneNumber) {
            this.showPaymentError('Veuillez entrer votre numéro de téléphone');
            return;
        }

        this.showPaymentLoading(true);
        this.paymentErrors.textContent = '';

        try {
            // Simuler le paiement Mobile Money
            await this.processMoMoPayment(email, phoneNumber, selectedProvider);
            
            // Générer l'ebook après paiement réussi
            await this.generateEbookAfterPayment();
            
        } catch (error) {
            this.showPaymentError(error.message);
        } finally {
            this.showPaymentLoading(false);
        }
    }

    async processMoMoPayment(email, phoneNumber, provider) {
        // Simuler le traitement du paiement Mobile Money
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simuler un paiement réussi à 90%
                if (Math.random() > 0.1) {
                    this.paymentCompleted = true;
                    resolve({ 
                        success: true, 
                        transactionId: 'MOMO_' + Math.random().toString(36).substr(2, 9),
                        provider: provider 
                    });
                } else {
                    reject(new Error('Paiement échoué. Veuillez réessayer ou contacter votre opérateur.'));
                }
            }, 3000); // Simuler un délai de 3 secondes pour le paiement MoMo
        });
    }

    async generateEbookAfterPayment() {
        if (!this.paymentCompleted) return;

        this.showPaymentLoading(true);

        try {
            // Récupérer les paramètres
            const title = this.titleInput.value.trim();
            const genre = this.genreSelect.value;
            const length = this.lengthSelect.value;
            const tone = this.toneSelect.value;
            const coverStyle = this.coverStyleSelect.value;
            const coverColor = this.coverColorSelect.value;

            // Simuler la génération de contenu
            await this.simulateGeneration();
            
            // Générer le contenu de l'ebook
            this.currentEbook = this.createEbookContent(title, genre, length, tone);
            this.currentEbook.coverStyle = coverStyle;
            this.currentEbook.coverColor = coverColor;
            
            // Générer la couverture
            await this.generateCover();
            
            // Afficher les résultats
            this.displayResults();
            
        } catch (error) {
            console.error('Erreur lors de la génération:', error);
            this.showPaymentError('Une erreur est survenue lors de la génération de l\'ebook.');
        } finally {
            this.showPaymentLoading(false);
        }
    }

    async simulateGeneration() {
        // Simuler un délai de traitement pour un effet réaliste
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    createEbookContent(title, genre, length, tone) {
        const wordCounts = {
            short: { min: 1000, max: 2000 },
            medium: { min: 3000, max: 5000 },
            long: { min: 6000, max: 10000 }
        };

        const chapterCounts = {
            short: 3,
            medium: 5,
            long: 8
        };

        const wordCount = this.getRandomInt(wordCounts[length].min, wordCounts[length].max);
        const chapterCount = chapterCounts[length];
        const pageCount = Math.ceil(wordCount / 250); // ~250 mots par page

        const chapters = this.generateChapters(title, genre, chapterCount, tone, wordCount);

        return {
            title,
            genre,
            length,
            tone,
            wordCount,
            pageCount,
            chapterCount,
            chapters,
            createdAt: new Date().toISOString()
        };
    }

    generateChapters(title, genre, chapterCount, tone, totalWords) {
        const chapters = [];
        const wordsPerChapter = Math.floor(totalWords / chapterCount);

        const chapterTemplates = {
            'fiction': [
                'Le début de l\'aventure',
                'La rencontre décisive',
                'Le premier obstacle',
                'La révélation surprenante',
                'Le tournant dramatique',
                'La confrontation finale',
                'La résolution',
                'L\'épilogue'
            ],
            'non-fiction': [
                'Introduction',
                'Les fondements',
                'Les principes clés',
                'Les applications pratiques',
                'Les études de cas',
                'Les meilleures pratiques',
                'Les perspectives futures',
                'Conclusion'
            ],
            'science-fiction': [
                'L\'anomalie spatiale',
                'La découverte',
                'Le premier contact',
                'La technologie inconnue',
                'Le voyage interstellaire',
                'La civilisation perdue',
                'Le retour sur Terre',
                'Le nouveau monde'
            ],
            'fantasy': [
                'L\'appel du destin',
                'Le royaume oublié',
                'La quête sacrée',
                'Les créatures mystiques',
                'L\'épreuve du courage',
                'La bataille épique',
                'Le pouvoir ancien',
                'Le couronnement'
            ],
            'romance': [
                'La rencontre fortuite',
                'Le premier regard',
                'Les doutes et les espoirs',
                'Le rapprochement',
                'L\'obstacle familial',
                'La déclaration',
                'Le choix du cœur',
                'Le happy end'
            ],
            'thriller': [
                'L\'incident déclencheur',
                'La première enquête',
                'Les pistes mystérieuses',
                'Le danger imminent',
                'La traque',
                'La confrontation',
                'La vérité révélée',
                'La justice rendue'
            ],
            'biography': [
                'Les origines',
                'L\'enfance formatrice',
                'Les premières ambitions',
                'Les défis surmontés',
                'Le succès',
                'Les épreuves',
                'L\'héritage',
                'La postérité'
            ],
            'self-help': [
                'Comprendre le problème',
                'Les bases du changement',
                'Les stratégies efficaces',
                'Les exercices pratiques',
                'Surmonter les obstacles',
                'Maintenir la motivation',
                'Mesurer les progrès',
                'Le plan d\'action'
            ]
        };

        const templates = chapterTemplates[genre] || chapterTemplates['fiction'];
        const toneModifiers = {
            'formal': 'de manière structurée et professionnelle',
            'casual': 'avec un style décontracté et accessible',
            'humorous': 'avec une touche d\'humour et de légèreté',
            'dramatic': 'avec intensité et émotion',
            'inspiring': 'avec inspiration et motivation'
        };

        for (let i = 0; i < chapterCount; i++) {
            const chapterTitle = templates[i] || `Chapitre ${i + 1}`;
            const content = this.generateChapterContent(
                title, 
                chapterTitle, 
                genre, 
                tone, 
                wordsPerChapter,
                toneModifiers[tone]
            );
            
            chapters.push({
                title: chapterTitle,
                content: content
            });
        }

        return chapters;
    }

    generateChapterContent(bookTitle, chapterTitle, genre, tone, wordCount, toneModifier) {
        const openingSentences = [
            `Dans ce chapitre, nous explorons ${chapterTitle.toLowerCase()} ${toneModifier}.`,
            `Ce chapitre se concentre sur ${chapterTitle.toLowerCase()}, abordant le sujet ${toneModifier}.`,
            `Nous plongeons maintenant dans ${chapterTitle.toLowerCase()}, avec une approche ${toneModifier}.`
        ];

        const middleContent = this.generateMiddleContent(genre, tone, Math.floor(wordCount * 0.6));
        const conclusion = [
            `Cette section nous amène naturellement vers la suite de notre exploration.`,
            `Avec ces éléments en place, nous pouvons maintenant passer à l'étape suivante.`,
            `Ces fondations nous préparent pour les développements à venir.`
        ];

        return `${openingSentences[Math.floor(Math.random() * openingSentences.length)]}\n\n${middleContent}\n\n${conclusion[Math.floor(Math.random() * conclusion.length)]}`;
    }

    generateMiddleContent(genre, tone, wordCount) {
        const contentTemplates = {
            "fiction": "Les personnages évoluent dans un monde riche et complexe, où chaque décision a des conséquences profondes. Les dialogues révèlent les motivations cachées et les relations se tissent avec une subtilité remarquable.",
            "non-fiction": "Les données et les recherches soutiennent chaque argument, offrant une perspective équilibrée et bien documentée. Les exemples concrets illustrent parfaitement les concepts abstraits.",
            "science-fiction": "Les technologies avancées et les concepts scientifiques s'entremêlent pour créer une vision futuriste crédible. Les questions philosophiques sur l'humanité et la conscience sont explorées en profondeur.",
            "fantasy": "La magie ancienne et les prophéties mystérieuses guident les héros dans leur quête. Les créatures fantastiques et les royaumes enchantés ajoutent une dimension merveilleuse à l'aventure.",
            "romance": "Les émotions vives et les sentiments profonds des personnages créent une connexion authentique avec le lecteur. Les moments partagés révèlent la véritable nature des relations.",
            "thriller": "La tension monte crescendo avec chaque rebondissement, gardant le lecteur en haleine. Les indices subtils et les fausses pistes maintiennent le mystère jusqu'à la fin.",
            "biography": "Les événements marquants de la vie sont présentés avec un souci du détail historique. Les témoignages et les documents d'époque apportent une authenticité précieuse.",
            "self-help": "Les conseils pratiques et les exercices concrets permettent une application immédiate des principes présentés. Les études de cas inspirent et motivent le changement."
        };

        const baseContent = contentTemplates[genre] || contentTemplates["fiction"];
        const sentences = Math.ceil(wordCount / 15); // ~15 mots par phrase
        const content = [];

        for (let i = 0; i < sentences; i++) {
            if (i === 0) {
                content.push(baseContent);
            } else {
                const variations = [
                    'Cette approche permet de mieux comprendre les enjeux actuels.',
                    'Les implications de cette analyse sont profondes et durables.',
                    'Il est essentiel de considérer ces différents aspects dans leur ensemble.',
                    'Cette perspective offre un éclairage nouveau sur la situation.',
                    'Les résultats obtenus dépassent les attentes initiales.'
                ];
                content.push(variations[Math.floor(Math.random() * variations.length)]);
            }
        }

        return content.join(' ');
    }

    displayResults() {
        if (!this.currentEbook) return;

        // Mettre à jour les informations de l'ebook
        document.getElementById('preview-title').textContent = this.currentEbook.title;
        document.getElementById('preview-meta').textContent = `${this.currentEbook.genre} • ${this.currentEbook.length} • ${this.currentEbook.tone}`;
        document.getElementById('word-count').textContent = this.currentEbook.wordCount.toLocaleString();
        document.getElementById('page-count').textContent = this.currentEbook.pageCount;
        document.getElementById('chapter-count').textContent = this.currentEbook.chapterCount;

        // Afficher un aperçu du contenu
        const preview = this.currentEbook.chapters[0]?.content.substring(0, 300) + '...' || '';
        document.getElementById('content-preview').textContent = preview;

        // Afficher la section des résultats
        this.generatorSection.style.display = 'none';
        this.resultSection.style.display = 'block';
    }

    downloadEbook(format) {
        if (!this.currentEbook) return;

        let content, filename, mimeType;

        switch (format) {
            case 'txt':
                content = this.generateTextContent();
                filename = `${this.currentEbook.title}.txt`;
                mimeType = 'text/plain';
                break;
            case 'pdf':
                content = this.generatePDFContent();
                filename = `${this.currentEbook.title}.pdf`;
                mimeType = 'application/pdf';
                break;
            case 'epub':
                content = this.generateEPUBContent();
                filename = `${this.currentEbook.title}.epub`;
                mimeType = 'application/epub+zip';
                break;
            default:
                return;
        }

        this.downloadFile(content, filename, mimeType);
    }

    generateTextContent() {
        let content = `${this.currentEbook.title}\n`;
        content += `Genre: ${this.currentEbook.genre}\n`;
        content += `Longueur: ${this.currentEbook.length}\n`;
        content += `Ton: ${this.currentEbook.tone}\n`;
        content += `Créé le: ${new Date(this.currentEbook.createdAt).toLocaleDateString()}\n\n`;
        content += '=' .repeat(50) + '\n\n';

        this.currentEbook.chapters.forEach((chapter, index) => {
            content += `Chapitre ${index + 1}: ${chapter.title}\n\n`;
            content += chapter.content + '\n\n';
            content += '-'.repeat(30) + '\n\n';
        });

        return content;
    }

    generatePDFContent() {
        // Pour l'instant, nous générons du contenu HTML simple
        // Dans une version réelle, vous utiliseriez une bibliothèque comme jsPDF
        let content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${this.currentEbook.title}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { text-align: center; color: #333; }
                h2 { color: #666; border-bottom: 1px solid #ccc; }
                .meta { text-align: center; color: #888; margin-bottom: 30px; }
            </style>
        </head>
        <body>
            <h1>${this.currentEbook.title}</h1>
            <div class="meta">
                <p>Genre: ${this.currentEbook.genre} | Longueur: ${this.currentEbook.length} | Ton: ${this.currentEbook.tone}</p>
                <p>Créé le: ${new Date(this.currentEbook.createdAt).toLocaleDateString()}</p>
            </div>
        `;

        this.currentEbook.chapters.forEach((chapter, index) => {
            content += `<h2>Chapitre ${index + 1}: ${chapter.title}</h2>`;
            content += `<p>${chapter.content.replace(/\n/g, '</p><p>')}</p>`;
        });

        content += '</body></html>';
        return content;
    }

    generateEPUBContent() {
        // Pour l'instant, nous retournons le contenu texte
        // Dans une version réelle, vous créeriez une structure EPUB valide
        return this.generateTextContent();
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    resetForm() {
        this.titleInput.value = '';
        this.charCount.textContent = '0';
        this.genreSelect.value = 'fiction';
        this.lengthSelect.value = 'short';
        this.toneSelect.value = 'formal';
        this.generateBtn.disabled = true;
        this.currentEbook = null;

        this.generatorSection.style.display = 'block';
        this.resultSection.style.display = 'none';
    }

    showLoading(show) {
        if (show) {
            this.btnText.style.display = 'none';
            this.btnLoader.style.display = 'inline';
            this.generateBtn.disabled = true;
        } else {
            this.btnText.style.display = 'inline';
            this.btnLoader.style.display = 'none';
            this.generateBtn.disabled = this.titleInput.value.trim().length === 0;
        }
    }

    showError(message) {
        // Créer un élément d'erreur
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background: #fef2f2;
            color: #dc2626;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            border: 1px solid #fecaca;
        `;

        this.generatorSection.appendChild(errorDiv);

        // Supprimer après 3 secondes
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

backToForm() {
        this.paymentSection.style.display = 'none';
        this.generatorSection.style.display = 'block';
        this.paymentErrors.textContent = '';
    }

    showPaymentLoading(show) {
        if (show) {
            this.submitPaymentBtn.querySelector('.btn-text').style.display = 'none';
            this.submitPaymentBtn.querySelector('.btn-loader').style.display = 'inline';
            this.submitPaymentBtn.disabled = true;
        } else {
            this.submitPaymentBtn.querySelector('.btn-text').style.display = 'inline';
            this.submitPaymentBtn.querySelector('.btn-loader').style.display = 'none';
            this.submitPaymentBtn.disabled = false;
        }
    }

    showPaymentError(message) {
        this.paymentErrors.textContent = message;
        setTimeout(() => {
            this.paymentErrors.textContent = '';
        }, 5000);
    }

    async generateCover() {
        const canvas = this.coverCanvas;
        const ctx = canvas.getContext('2d');
        const { title, coverStyle, coverColor } = this.currentEbook;

        // Dimensions de la couverture (ratio 2:3)
        canvas.width = 300;
        canvas.height = 450;

        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Appliquer le style de couverture
        switch (coverStyle) {
            case 'modern':
                this.drawModernCover(ctx, title, coverColor);
                break;
            case 'classic':
                this.drawClassicCover(ctx, title, coverColor);
                break;
            case 'minimalist':
                this.drawMinimalistCover(ctx, title, coverColor);
                break;
            case 'bold':
                this.drawBoldCover(ctx, title, coverColor);
                break;
            case 'elegant':
                this.drawElegantCover(ctx, title, coverColor);
                break;
            default:
                this.drawModernCover(ctx, title, coverColor);
        }
    }

    drawModernCover(ctx, title, color) {
        // Fond dégradé moderne
        const gradient = ctx.createLinearGradient(0, 0, 0, 450);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, this.adjustColor(color, -30));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 300, 450);

        // Rectangle blanc pour le texte
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(30, 150, 240, 150);

        // Titre
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'center';
        this.wrapText(ctx, title, 150, 200, 200, 30);

        // Auteur
        ctx.fillStyle = '#666';
        ctx.font = '14px Inter';
        ctx.fillText('Généré par AI', 150, 270);

        // Décoration
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(50, 290);
        ctx.lineTo(250, 290);
        ctx.stroke();
    }

    drawClassicCover(ctx, title, color) {
        // Fond classique
        ctx.fillStyle = '#f8f8f8';
        ctx.fillRect(0, 0, 300, 450);

        // Bordure
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, 260, 410);

        // Titre
        ctx.fillStyle = color;
        ctx.font = 'bold 22px Georgia';
        ctx.textAlign = 'center';
        this.wrapText(ctx, title, 150, 180, 220, 28);

        // Ligne décorative
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, 250);
        ctx.lineTo(220, 250);
        ctx.stroke();

        // Sous-titre
        ctx.fillStyle = '#666';
        ctx.font = 'italic 14px Georgia';
        ctx.fillText('Un ebook unique', 150, 280);
    }

    drawMinimalistCover(ctx, title, color) {
        // Fond minimaliste
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 300, 450);

        // Titre
        ctx.fillStyle = color;
        ctx.font = '300 20px Inter';
        ctx.textAlign = 'center';
        this.wrapText(ctx, title.toUpperCase(), 150, 200, 250, 25);

        // Ligne fine
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(100, 250);
        ctx.lineTo(200, 250);
        ctx.stroke();
    }

    drawBoldCover(ctx, title, color) {
        // Fond audacieux
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 300, 450);

        // Cercle décoratif
        ctx.fillStyle = this.adjustColor(color, 20);
        ctx.beginPath();
        ctx.arc(150, 225, 80, 0, Math.PI * 2);
        ctx.fill();

        // Titre en blanc
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px Inter';
        ctx.textAlign = 'center';
        this.wrapText(ctx, title, 150, 220, 160, 32);
    }

    drawElegantCover(ctx, title, color) {
        // Fond dégradé élégant
        const gradient = ctx.createRadialGradient(150, 225, 0, 150, 225, 200);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, this.adjustColor(color, -20));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 300, 450);

        // Cadre élégant
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(40, 80, 220, 290);
        ctx.setLineDash([]);

        // Titre
        ctx.fillStyle = color;
        ctx.font = '500 18px Georgia';
        ctx.textAlign = 'center';
        this.wrapText(ctx, title, 150, 200, 180, 24);

        // Ornement
        ctx.font = '24px serif';
        ctx.fillText('❦', 150, 320);
    }

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let testLine = '';
        let metrics;

        for (let n = 0; n < words.length; n++) {
            testLine = line + words[n] + ' ';
            metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }

    adjustColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    }

    displayResults() {
        if (!this.currentEbook) return;

        // Mettre à jour les statistiques
        document.getElementById('word-count').textContent = this.currentEbook.wordCount.toLocaleString();
        document.getElementById('page-count').textContent = this.currentEbook.pageCount;
        document.getElementById('chapter-count').textContent = this.currentEbook.chapterCount;

        // Afficher un aperçu du contenu
        const preview = this.currentEbook.chapters[0]?.content.substring(0, 300) + '...' || '';
        document.getElementById('content-preview').textContent = preview;

        // Afficher la section des résultats
        this.paymentSection.style.display = 'none';
        this.resultSection.style.display = 'block';
    }

    downloadEbook(format) {
        if (!this.currentEbook) return;

        let content, filename, mimeType;

        switch (format) {
            case 'txt':
                content = this.generateTextContent();
                filename = `${this.currentEbook.title}.txt`;
                mimeType = 'text/plain';
                break;
            case 'pdf':
                content = this.generatePDFContent();
                filename = `${this.currentEbook.title}.pdf`;
                mimeType = 'application/pdf';
                break;
            case 'epub':
                content = this.generateEPUBContent();
                filename = `${this.currentEbook.title}.epub`;
                mimeType = 'application/epub+zip';
                break;
            default:
                return;
        }

        this.downloadFile(content, filename, mimeType);
    }

    downloadCover() {
        if (!this.currentEbook) return;

        this.coverCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${this.currentEbook.title}_cover.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }

    generateTextContent() {
        let content = `${this.currentEbook.title}\n`;
        content += `Genre: ${this.currentEbook.genre}\n`;
        content += `Longueur: ${this.currentEbook.length}\n`;
        content += `Ton: ${this.currentEbook.tone}\n`;
        content += `Créé le: ${new Date(this.currentEbook.createdAt).toLocaleDateString()}\n\n`;
        content += '=' .repeat(50) + '\n\n';

        this.currentEbook.chapters.forEach((chapter, index) => {
            content += `Chapitre ${index + 1}: ${chapter.title}\n\n`;
            content += chapter.content + '\n\n';
            content += '-'.repeat(30) + '\n\n';
        });

        return content;
    }

    generatePDFContent() {
        let content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${this.currentEbook.title}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { text-align: center; color: #333; }
                h2 { color: #666; border-bottom: 1px solid #ccc; }
                .cover-page { text-align: center; page-break-after: always; }
                .meta { text-align: center; color: #888; margin-bottom: 30px; }
                .cover-img { max-width: 300px; margin: 20px auto; }
            </style>
        </head>
        <body>
            <div class="cover-page">
                <div class="cover-img">
                    <img src="${this.coverCanvas.toDataURL('image/png')}" alt="Couverture" style="max-width: 100%; height: auto;">
                </div>
                <h1>${this.currentEbook.title}</h1>
                <div class="meta">
                    <p>Genre: ${this.currentEbook.genre} | Longueur: ${this.currentEbook.length}</p>
                    <p>Créé le: ${new Date(this.currentEbook.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        `;

        this.currentEbook.chapters.forEach((chapter, index) => {
            content += `<h2>Chapitre ${index + 1}: ${chapter.title}</h2>`;
            content += `<p>${chapter.content.replace(/\n/g, '</p><p>')}</p>`;
        });

        content += '</body></html>';
        return content;
    }

    generateEPUBContent() {
        return this.generateTextContent();
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    resetForm() {
        this.titleInput.value = '';
        this.charCount.textContent = '0';
        this.genreSelect.value = 'fiction';
        this.lengthSelect.value = 'short';
        this.toneSelect.value = 'formel';
        this.coverStyleSelect.value = 'modern';
        this.coverColorSelect.value = '#6366f1';
        this.emailInput.value = '';
        this.phoneNumberInput.value = '';
        this.generateBtn.disabled = true;
        this.currentEbook = null;
        this.paymentCompleted = false;

        this.generatorSection.style.display = 'block';
        this.paymentSection.style.display = 'none';
        this.resultSection.style.display = 'none';
        this.paymentErrors.textContent = '';
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Initialiser l'application lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new EbookGenerator();
});
