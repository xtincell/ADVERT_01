# 📦 ADVERTIS v2.0 Package - Instructions d'Installation

## 📥 Archive Fournie

**Fichier** : `ADVERTIS_v01_package.tar.gz`
**Taille** : 2.1 MB
**Contenu** : 298 fichiers (93 fichiers source + historique Git complet)
**Commit initial** : `b7fb5a5` - "Initial ADVERTIS v2.0 Package - Production Ready"

---

## 🚀 Installation en 3 Étapes

### Étape 1 : Extraire l'Archive

```bash
# Extraire dans ton répertoire de travail
tar -xzf ADVERTIS_v01_package.tar.gz

# Vérifier l'extraction
cd ADVERTIS_v01
ls -la
```

Tu devrais voir :
```
ADVERTIS_v01/
├── .git/              # Historique Git complet
├── README.md          # Guide du package
├── MANIFEST.txt       # Inventaire détaillé
├── UPDATE-NOTES.md    # Changelog v2.0
├── auto-update.sh     # Script d'automation
├── docs/              # Documentation complète
├── interface/         # Templates et assets
└── reference/         # Archive de référence
```

---

### Étape 2 : Vérifier le Repository Git

```bash
cd ADVERTIS_v01

# Vérifier le commit
git log --oneline -1
# Devrait afficher : b7fb5a5 Initial ADVERTIS v2.0 Package - Production Ready

# Vérifier le status
git status
# Devrait afficher : On branch main, nothing to commit, working tree clean

# Vérifier le remote
git remote -v
# Devrait afficher : origin http://local_proxy@127.0.0.1:56928/git/xtincell/ADVERTIS_v01.git
```

---

### Étape 3 : Pusher vers GitHub

#### Option A : Push Direct (Si le Proxy est Maintenant Autorisé)

```bash
cd ADVERTIS_v01
git push -u origin main
```

#### Option B : Reconfigurer le Remote pour GitHub Direct

```bash
cd ADVERTIS_v01

# Utiliser HTTPS avec token
git remote set-url origin https://YOUR_GITHUB_TOKEN@github.com/xtincell/ADVERTIS_v01.git
git push -u origin main

# OU utiliser SSH (si configuré)
git remote set-url origin git@github.com:xtincell/ADVERTIS_v01.git
git push -u origin main
```

---

## 📊 Contenu du Package

### TIER 1 — Production Core (20 fichiers)
```
docs/research/
├── domain-advert-method-guide-research-2026-02-08.md
├── domain-advert-method-guide-research-2026-02-08-FR.md
├── recherche-strategique-methodologies-branding-agences-majeures.md
└── deliverables-architecture-research.md

docs/specifications/
├── 00-MASTER-SPECIFICATIONS.md
├── 01-DOCUMENT-S-TEMPLATE.md
├── 02-DOCUMENT-A-TEMPLATE.md
├── 03-DOCUMENT-D-TEMPLATE.md
├── 04-DOCUMENT-V-TEMPLATE.md
├── 05-DOCUMENT-E-TEMPLATE.md
├── 06-DOCUMENT-R-TEMPLATE.md
├── 07-DOCUMENT-T-TEMPLATE.md
└── 08-DOCUMENT-I-TEMPLATE.md

interface/
├── templates/ (4 fichiers HTML)
├── assets/css/ (2 fichiers)
└── assets/js/ (4 fichiers)
```

### TIER 2 — Methodology Documentation (28 fichiers)
```
docs/guide/
├── ADVERTIS-Guide-Complet.md (3,800+ lignes)
└── annexes/
    ├── annexe-a-variables.md (47 variables)
    ├── annexe-b-templates-piliers.md (8 templates)
    ├── annexe-c-questions-entretien.md (215+ questions)
    ├── annexe-d-template-swot.md
    ├── annexe-e-template-strategie.md (Document S + Interface S)
    ├── annexe-f-checklists-reglementaires.md
    └── annexe-g-protocole-donnees.md

docs/architecture/
├── INTERFACE-ARCHITECTURE.md
├── advertis-agent-army-architecture.md
└── architecture.md

docs/planning/
├── ADVERTIS_02-PRD.md
├── ADVERTIS-Product-Brief.md
├── epics.md (16 epics, 149 stories)
├── ux-design-specification.md
├── ux-spec-interface-presentation-advertis.md
├── ADVERTIS-DELIVERY.md
├── ADVERTIS-MIGRATION-STATUS.md
└── prd-validation-report.md
```

### TIER 3 — Reference Archive (20 fichiers)
```
reference/
├── amara-demo/documents/ (16 fichiers HTML)
├── interactive-demos/ (3 fichiers HTML)
└── historical/ (1 fichier MD)
```

---

## 🎯 Vérifications Post-Installation

### Test 1 : Framework Variables
```bash
grep "8 piliers" docs/guide/ADVERTIS-Guide-Complet.md
# Devrait trouver 50+ occurrences

grep "Pilier I" docs/guide/ADVERTIS-Guide-Complet.md
# Devrait trouver le Chapitre 10 complet
```

### Test 2 : Architecture
```bash
cat docs/architecture/advertis-agent-army-architecture.md | grep "Agent I"
# Devrait afficher : Agent I - Implementation Planner

cat docs/architecture/advertis-agent-army-architecture.md | grep "Agent S"
# Devrait afficher : Agent S - Strategy Bible + Interface Orchestrator
```

### Test 3 : Interface Templates
```bash
grep "ADVERTIS" interface/templates/index.html
# Devrait trouver références ADVERTIS (pas AMARA)
```

---

## 📈 Statistiques du Package

| Métrique | Valeur |
|----------|--------|
| **Total fichiers** | 93 fichiers sources |
| **Taille compressée** | 2.1 MB (tar.gz) |
| **Taille décompressée** | ~3.7 MB |
| **Lignes de documentation** | 82,714 lignes |
| **Variables framework** | 47 variables |
| **Piliers** | 8 piliers (S, A, D, V, E, R, T, I) |
| **Templates** | 8 templates complets |
| **Questions discovery** | 215+ questions |
| **Epics** | 16 epics |
| **User Stories** | 149 stories |

---

## 🌟 Fonctionnalités Principales

### Pilier I - Implementation Planner
✅ Roadmap 12-24 mois
✅ Budget & ROI calculator
✅ Quick wins identification
✅ Resource allocation
✅ Team planning

### Pilier S - Strategy (Dual Nature)
✅ Document S : Strategy Bible (50-120 pages PDF)
✅ Interface S : Strategic Cockpit (Web dashboard)
✅ Real-time KPI tracking
✅ Financial clarity monitoring
✅ Multi-user access
✅ WCAG 2.1 AA compliant

---

## 🆘 Support & Troubleshooting

### Problème : Git Remote Incorrect

```bash
# Vérifier le remote actuel
git remote -v

# Mettre à jour si nécessaire
git remote set-url origin https://github.com/xtincell/ADVERTIS_v01.git
# OU
git remote set-url origin git@github.com:xtincell/ADVERTIS_v01.git
```

### Problème : Permission Denied lors du Push

```bash
# Option 1 : Utiliser un Personal Access Token
git remote set-url origin https://YOUR_TOKEN@github.com/xtincell/ADVERTIS_v01.git

# Option 2 : Vérifier tes SSH keys
ssh -T git@github.com
```

### Problème : L'Archive Ne S'Extrait Pas

```bash
# Vérifier l'intégrité
tar -tzf ADVERTIS_v01_package.tar.gz > /dev/null && echo "Archive OK"

# Forcer l'extraction
tar -xzf ADVERTIS_v01_package.tar.gz --overwrite
```

---

## 🎉 Prochaines Étapes

Une fois pushé sur GitHub :

1. **Vérifier le repo en ligne** : https://github.com/xtincell/ADVERTIS_v01
2. **Créer une release** : Tag v2.0.0 pour marquer la version
3. **Setup GitHub Pages** (optionnel) : Pour héberger les démos HTML
4. **Inviter collaborateurs** : Si travail en équipe
5. **Configurer CI/CD** (optionnel) : Tests automatisés

---

## 📞 Questions ?

- **Documentation complète** : Voir `README.md` dans le package
- **Inventaire détaillé** : Voir `MANIFEST.txt`
- **Changelog** : Voir `UPDATE-NOTES.md`
- **Guide interface** : Voir `interface/INTEGRATION-GUIDE.md`

---

**Package créé avec Claude Code**
**Date** : 2026-02-15
**Version** : ADVERTIS v2.0 - Production Ready
**Repository** : https://github.com/xtincell/ADVERTIS_v01
