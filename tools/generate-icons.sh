#!/bin/bash

# Vérifier si ImageMagick est installé
if ! command -v convert &> /dev/null; then
    echo "ImageMagick n'est pas installé. Installation nécessaire:"
    echo "sudo apt-get install imagemagick"
    exit 1
fi

# Tailles d'icônes nécessaires
sizes=(72 96 128 144 152 192 384 512)

# Créer le dossier icons s'il n'existe pas
mkdir -p icons

# Générer les icônes pour chaque taille
for size in "${sizes[@]}"; do
    convert  -background none   logo-app.png -resize ${size}x${size} ../icons/icon-${size}x${size}.png
done

echo "Génération des icônes terminée"
