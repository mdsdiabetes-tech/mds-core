# \# MDS Knowledge Graph

# 

# \## Status

# 

# Draft

# 

# \## Purpose

# 

# The MDS Knowledge Graph is the core intelligence layer of MDS Core.

# 

# It connects products, brands, devices, medications, diseases, guides, FAQs, reviews, videos, and customer problems into one structured system.

# 

# \## Core Principle

# 

# MDS Core should not store isolated products.

# 

# It should store relationships.

# 

# \## Example

# 

# Humalog connects to:

# 

# \- Insulin storage

# \- Cold chain requirements

# \- Travel coolers

# \- Diabetes travel guides

# \- TSA guidance

# \- Emergency kits

# \- Related FAQs

# 

# Dexcom G7 connects to:

# 

# \- CGM patches

# \- Receiver accessories

# \- Compatible cases

# \- Troubleshooting guides

# \- Comparison pages

# \- Customer reviews

# \- Related videos

# 

# \## Initial Node Types

# 

# \- Product

# \- Brand

# \- Manufacturer

# \- Category

# \- Disease

# \- Medication

# \- Device

# \- Article

# \- FAQ

# \- Video

# \- Review

# \- Bundle

# 

# \## Initial Relationship Types

# 

# \- belongs\_to\_brand

# \- made\_by\_manufacturer

# \- belongs\_to\_category

# \- compatible\_with\_device

# \- compatible\_with\_medication

# \- recommended\_for\_disease

# \- related\_product

# \- alternative\_product

# \- has\_faq

# \- has\_article

# \- has\_video

# \- has\_review

# \- included\_in\_bundle

# 

# \## Goal

# 

# One product record should help generate:

# 

# \- Product pages

# \- FAQ pages

# \- Buying guides

# \- Comparison pages

# \- AI answers

# \- Search results

# \- Product recommendations

# \- Bundles

# \- Schema markup

