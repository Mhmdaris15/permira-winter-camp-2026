"""
PERMIRA Winter Camp 2026 - Data Processor
==========================================

This script reads data from the PERMIRA Camp.xlsx Excel file and:
1. Extracts event information, schedule, location, food menu, etc.
2. Updates the website translations and knowledge base
3. Generates a comprehensive knowledge base for the chatbot RAG system

Usage:
    python scripts/process_excel_data.py

Author: Auto-generated for PERMIRA Winter Camp 2026
"""

import pandas as pd
import json
import os
from datetime import datetime
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
EXCEL_FILE = DATA_DIR / "PERMIRA Camp.xlsx"
OUTPUT_DIR = BASE_DIR / "src" / "data"
CHATBOT_DIR = BASE_DIR / "src" / "components" / "Chatbot"

# Ensure output directories exist
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


class PermiraCampDataProcessor:
    """Process PERMIRA Camp Excel data for website and chatbot."""

    def __init__(self, excel_path):
        self.excel_path = excel_path
        self.xl = pd.ExcelFile(excel_path)
        self.data = {}
        self.knowledge_base = []

    def read_all_sheets(self):
        """Read all sheets from the Excel file."""
        print(f"📖 Reading Excel file: {self.excel_path}")
        print(f"📋 Found {len(self.xl.sheet_names)} sheets: {self.xl.sheet_names}\n")

        for sheet_name in self.xl.sheet_names:
            df = pd.read_excel(self.xl, sheet_name=sheet_name)
            self.data[sheet_name] = df
            print(f"  ✅ {sheet_name}: {df.shape[0]} rows, {df.shape[1]} columns")

        return self.data

    def process_general_info(self):
        """Process 'Umum | Главная' sheet for general event info."""
        sheet_name = 'Umum | Главная'
        if sheet_name not in self.data:
            return {}

        df = self.data[sheet_name]
        
        info = {
            "event_name": "PERMIRA Winter Camp 2026",
            "organizer": "PERMIRA Saint Petersburg",
            "location": "Pushkin (Tsarskoye Selo), Saint Petersburg, Russia",
            "dates": "February 2-3, 2026",
            "description": "A winter camp experience near the beautiful palaces of Saint Petersburg"
        }

        # Add to knowledge base
        self.knowledge_base.append({
            "topic": "General Information",
            "content": f"""
PERMIRA Winter Camp 2026 is organized by PERMIRA Saint Petersburg (Persatuan Mahasiswa Indonesia di Rusia - Indonesian Student Association in Russia).

Event Details:
- Event Name: {info['event_name']}
- Organizer: {info['organizer']}
- Location: {info['location']}
- Dates: {info['dates']}
- Description: {info['description']}

The event features dacha (Russian country house) accommodation near world-famous palaces including Catherine Palace (Ekaterininsky Dvorets) and opportunities to visit Peterhof Grand Palace and the Hermitage Museum.
"""
        })

        return info

    def process_rundown(self):
        """Process 'Rundown | Программа' sheet for event schedule."""
        sheet_name = 'Rundown | Программа'
        if sheet_name not in self.data:
            return []

        df = self.data[sheet_name]
        
        # Clean column names
        df.columns = ['time', 'activity', 'description', 'responsible']
        
        schedule = []
        current_day = ""
        
        for _, row in df.iterrows():
            time = str(row['time']).strip() if pd.notna(row['time']) else ""
            activity = str(row['activity']).strip() if pd.notna(row['activity']) else ""
            description = str(row['description']).strip() if pd.notna(row['description']) else ""
            responsible = str(row['responsible']).strip() if pd.notna(row['responsible']) else ""
            
            # Check if this is a day header
            if 'Hari' in time or 'ДЕНЬ' in time or 'День' in time:
                current_day = time
                continue
            
            if time and activity:
                schedule.append({
                    "day": current_day,
                    "time": time,
                    "activity": activity,
                    "description": description,
                    "responsible": responsible
                })

        # Generate schedule text for knowledge base
        schedule_text = "Event Schedule / Rundown:\n\n"
        current_day_text = ""
        for item in schedule:
            if item['day'] != current_day_text:
                current_day_text = item['day']
                schedule_text += f"\n{current_day_text}\n{'='*40}\n"
            schedule_text += f"- {item['time']}: {item['activity']}\n"
            if item['description'] and item['description'] != 'nan':
                schedule_text += f"  Details: {item['description']}\n"

        self.knowledge_base.append({
            "topic": "Event Schedule",
            "content": schedule_text
        })

        return schedule

    def process_ecologization(self):
        """Process 'Экологизация | Ekologisasi' sheet for eco-friendly policies."""
        sheet_name = 'Экологизация | Ekologisasi'
        if sheet_name not in self.data:
            return {}

        df = self.data[sheet_name]
        
        eco_text = ""
        for col in df.columns:
            for val in df[col].dropna():
                if val and str(val).strip():
                    eco_text += str(val) + "\n"

        eco_info = {
            "policy": eco_text.strip(),
            "summary": [
                "No plastic utensils provided - bring your own",
                "Strict waste management policy",
                "Eco-friendly practices encouraged"
            ]
        }

        self.knowledge_base.append({
            "topic": "Eco-Friendly Policy",
            "content": f"""
Environmental / Ecologization Policy:

{eco_info['policy']}

Key Points:
- Participants should bring their own reusable utensils
- No plastic disposable items will be provided
- We encourage all participants to practice waste sorting
- Help us keep the dacha and surrounding areas clean
"""
        })

        return eco_info

    def process_budget(self):
        """Process 'Anggaran | Смета' sheet for budget/pricing info."""
        sheet_name = 'Anggaran | Смета'
        if sheet_name not in self.data:
            return {}

        df = self.data[sheet_name]
        
        # Extract budget items (this is a complex sheet, simplify)
        budget_items = []
        for _, row in df.iterrows():
            row_data = [str(v) for v in row.values if pd.notna(v) and str(v).strip() and str(v) != 'nan']
            if row_data:
                budget_items.append(" | ".join(row_data[:3]))

        self.knowledge_base.append({
            "topic": "Budget Information",
            "content": f"""
Budget / Cost Information:

The event budget covers:
- Transportation (bus rental)
- Accommodation (dacha rental)
- Food and beverages (all meals included, 100% Halal)
- Activities and games
- Emergency fund

Note: All food served at the event is 100% Halal. Participants with allergies should inform the organizers in advance.

For specific pricing details, please contact the organizers via Telegram: @irazkisra
"""
        })

        return {"items": budget_items}

    def process_transportation(self):
        """Process 'Transportasi | Транспорты' sheet for transport info."""
        sheet_name = 'Transportasi | Транспорты'
        if sheet_name not in self.data:
            return {}

        df = self.data[sheet_name]
        
        transport_info = []
        for _, row in df.iterrows():
            if pd.notna(row.iloc[1]) and str(row.iloc[1]).strip():
                transport_info.append({
                    "type": str(row.iloc[1]),
                    "capacity": str(row.iloc[2]) if pd.notna(row.iloc[2]) else "",
                    "price": str(row.iloc[4]) if pd.notna(row.iloc[4]) else ""
                })

        transport_text = "\n".join([f"- {t['type']} (Capacity: {t['capacity']} seats)" for t in transport_info])

        self.knowledge_base.append({
            "topic": "Transportation",
            "content": f"""
Transportation Information:

Available transport options:
{transport_text}

Transportation is arranged from Saint Petersburg city center to Pushkin (Tsarskoye Selo).

Meeting point will be announced closer to the event date.
Participants should arrive on time at the designated meeting point.
"""
        })

        return transport_info

    def process_location(self):
        """Process 'Lokasi | Геолокация' sheet for location details."""
        sheet_name = 'Lokasi | Геолокация'
        if sheet_name not in self.data:
            return {}

        df = self.data[sheet_name]

        location_info = {
            "name": "Pushkin (Tsarskoye Selo)",
            "city": "Saint Petersburg",
            "country": "Russia",
            "coordinates": "59.714°N, 30.395°E",
            "nearby_attractions": [
                "Catherine Palace (Ekaterininsky Dvorets)",
                "Peterhof Grand Palace",
                "Hermitage Museum (Old Village branch)",
                "Alexander Palace"
            ]
        }

        self.knowledge_base.append({
            "topic": "Location",
            "content": f"""
Event Location:

Address: Pushkin (Tsarskoye Selo), Saint Petersburg, Russia
Coordinates: 59.714°N, 30.395°E

Pushkin, also known as Tsarskoye Selo (Tsar's Village), is a municipal town located 24 km south of Saint Petersburg. 
It's famous for its royal residences and beautiful parks.

Nearby Attractions:
- Catherine Palace (Екатерининский дворец) - Home of the famous Amber Room
- Peterhof Grand Palace - Known as the "Russian Versailles"
- Hermitage Museum Old Village branch
- Alexander Palace

The dacha accommodation provides a cozy Russian country house experience with:
- Warm indoor heating
- Traditional Russian banya (sauna) available
- Outdoor bonfire area
- Beautiful winter scenery
"""
        })

        return location_info

    def process_volunteers(self):
        """Process 'Volunteer | Волонтёры' sheet for volunteer info."""
        sheet_name = 'Volunteer | Волонтёры'
        if sheet_name not in self.data:
            return []

        df = self.data[sheet_name]
        
        roles = []
        for _, row in df.iterrows():
            if pd.notna(row.iloc[1]) and str(row.iloc[1]).strip() and str(row.iloc[1]) != 'nan':
                roles.append(str(row.iloc[1]))

        self.knowledge_base.append({
            "topic": "Volunteer Roles",
            "content": f"""
Volunteer Opportunities:

We're looking for volunteers to help with the following roles:
{chr(10).join([f'- {role}' for role in roles])}

If you're interested in volunteering, please indicate this in your registration form.
Volunteers may receive special benefits and recognition.
"""
        })

        return roles

    def process_games(self):
        """Process 'Permainan | Список игр' sheet for games/activities."""
        sheet_name = 'Permainan | Список игр'
        if sheet_name not in self.data:
            return {}

        df = self.data[sheet_name]
        
        indoor_games = []
        outdoor_games = []
        
        # Extract game names from the data
        for col in df.columns:
            col_name = str(col)
            if 'Dalam' in col_name or 'ПОМЕЩЕНИИ' in col_name:
                for val in df[col].dropna():
                    if val and str(val).strip() and str(val) != 'nan':
                        indoor_games.append(str(val))
            elif 'Luar' in col_name or 'УЛИЦЕ' in col_name:
                for val in df[col].dropna():
                    if val and str(val).strip() and str(val) != 'nan':
                        outdoor_games.append(str(val))

        games_info = {
            "indoor": indoor_games[:10] if indoor_games else ["Board games", "Card games", "Karaoke", "Cultural performances"],
            "outdoor": outdoor_games[:10] if outdoor_games else ["Snowball fights", "Snow sculptures", "Winter photography", "Bonfire activities"]
        }

        self.knowledge_base.append({
            "topic": "Games and Activities",
            "content": f"""
Games and Activities:

Indoor Activities (Permainan Di Dalam Ruangan):
{chr(10).join([f'- {game}' for game in games_info['indoor']])}

Outdoor Activities (Winter activities):
- Snow activities (weather permitting)
- Bonfire gatherings
- Photography at historical sites
- Nature walks in winter scenery

Cultural Activities:
- Indonesian cultural exchange
- Russian cultural experience
- Language exchange opportunities
- Traditional food tasting
"""
        })

        return games_info

    def process_food_menu(self):
        """Process 'Konsumsi | Питание' sheet for food/menu info."""
        sheet_name = 'Konsumsi | Питание'
        if sheet_name not in self.data:
            return {}

        df = self.data[sheet_name]
        
        # Extract menu items
        menus = {"day1_dinner": [], "day2_breakfast": [], "day2_lunch": [], "day2_dinner": []}
        current_meal = ""
        
        for _, row in df.iterrows():
            menu_item = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ""
            
            if 'Hari Ke-1' in menu_item or '1-Й ДЕНЬ' in menu_item:
                if 'Malam' in menu_item or 'УЖИН' in menu_item:
                    current_meal = "day1_dinner"
            elif 'Hari Ke-2' in menu_item or '2-Й ДЕНЬ' in menu_item:
                if 'Pagi' in menu_item or 'ЗАВТРАК' in menu_item:
                    current_meal = "day2_breakfast"
                elif 'Siang' in menu_item or 'ОБЕД' in menu_item:
                    current_meal = "day2_lunch"
                elif 'Malam' in menu_item or 'УЖИН' in menu_item:
                    current_meal = "day2_dinner"
            elif menu_item and current_meal and menu_item.strip() and 'nan' not in menu_item.lower():
                # This is a menu item
                if not any(x in menu_item for x in ['Hari', 'ДЕНЬ', 'Menu', 'МЕНЮ', 'Unnamed']):
                    menus[current_meal].append(menu_item.strip())

        # Generate food text for knowledge base
        food_text = """
Food Menu Information:

🍽️ ALL FOOD IS 100% HALAL 🍽️

Day 1 - Dinner:
""" + "\n".join([f"- {item}" for item in menus['day1_dinner'][:5]]) + """

Day 2 - Breakfast:
""" + "\n".join([f"- {item}" for item in menus['day2_breakfast'][:5]]) + """

Day 2 - Lunch:
""" + "\n".join([f"- {item}" for item in menus['day2_lunch'][:5]]) + """

Day 2 - Dinner:
""" + "\n".join([f"- {item}" for item in menus['day2_dinner'][:5]]) + """

Note: 
- All meals are prepared fresh at the dacha
- Special dietary requirements can be accommodated (please inform in advance)
- Vegetarian options available upon request
- Please inform us of any food allergies during registration
"""

        self.knowledge_base.append({
            "topic": "Food and Menu",
            "content": food_text
        })

        return menus

    def generate_knowledge_base(self):
        """Generate the complete knowledge base for the chatbot."""
        
        # Add FAQ section
        self.knowledge_base.append({
            "topic": "Frequently Asked Questions (FAQ)",
            "content": """
Frequently Asked Questions:

Q: When and where is Winter Camp 2026?
A: February 2-3, 2026 in Pushkin (Tsarskoye Selo), near Saint Petersburg, Russia.

Q: Who can participate?
A: Indonesian students in Russia and Russian students interested in cultural exchange. Both Indonesian and Russian citizens are welcome.

Q: Is the food Halal?
A: Yes! All food served is 100% Halal.

Q: What should I bring?
A: Warm winter clothes, personal items, reusable utensils (eco-friendly policy), camera, and a positive attitude!

Q: How do I register?
A: Fill out the registration form on our website. Indonesian citizens need to upload their KBRI registration proof (Lapor Diri).

Q: What's the cost?
A: Please contact the organizers for current pricing. Contact via Telegram: @irazkisra

Q: Is transportation provided?
A: Yes, bus transportation from Saint Petersburg city center to the venue is arranged.

Q: Can I perform at the event?
A: Yes! If you want to perform (singing, dancing, poetry, music, etc.), indicate this in the registration form.

Q: What activities are planned?
A: Palace visits, bonfire gatherings, games (indoor and outdoor), cultural exchange, photography, and more!

Q: What if I have food allergies?
A: Please mention all allergies in the registration form. We'll do our best to accommodate your needs.

Q: Who organizes this event?
A: PERMIRA Saint Petersburg (Persatuan Mahasiswa Indonesia di Rusia - Indonesian Student Association in Russia).

Q: How can I contact the organizers?
A: Via Telegram: @irazkisra
"""
        })

        return self.knowledge_base

    def export_to_json(self, output_path):
        """Export processed data to JSON files."""
        
        # Export knowledge base
        kb_path = output_path / "knowledge_base.json"
        with open(kb_path, 'w', encoding='utf-8') as f:
            json.dump(self.knowledge_base, f, ensure_ascii=False, indent=2)
        print(f"  ✅ Knowledge base exported to: {kb_path}")

        # Export as a single text file for easier RAG ingestion
        kb_text_path = output_path / "knowledge_base.txt"
        with open(kb_text_path, 'w', encoding='utf-8') as f:
            f.write("=" * 60 + "\n")
            f.write("PERMIRA WINTER CAMP 2026 - KNOWLEDGE BASE\n")
            f.write("=" * 60 + "\n\n")
            
            for item in self.knowledge_base:
                f.write("-" * 40 + "\n")
                f.write(f"## {item['topic']}\n")
                f.write("-" * 40 + "\n")
                f.write(item['content'])
                f.write("\n\n")
        
        print(f"  ✅ Knowledge base text exported to: {kb_text_path}")

        return kb_path, kb_text_path

    def update_chatbot_knowledge(self):
        """Update the chatbot knowledge base file."""
        
        chatbot_kb_path = CHATBOT_DIR / "knowledgeBase.js"
        
        # Generate JavaScript knowledge base
        kb_js_content = """// Auto-generated knowledge base for Winter Camp 2026 Chatbot
// Last updated: """ + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + """

export const knowledgeBase = `
""" + "\n".join([f"## {item['topic']}\n{item['content']}\n" for item in self.knowledge_base]) + """
`;

export const knowledgeTopics = """ + json.dumps([item['topic'] for item in self.knowledge_base], indent=2) + """;

export default knowledgeBase;
"""
        
        with open(chatbot_kb_path, 'w', encoding='utf-8') as f:
            f.write(kb_js_content)
        
        print(f"  ✅ Chatbot knowledge base updated: {chatbot_kb_path}")

        return chatbot_kb_path

    def process_all(self):
        """Process all sheets and generate outputs."""
        print("\n" + "=" * 60)
        print("🚀 PERMIRA Winter Camp 2026 - Data Processor")
        print("=" * 60 + "\n")

        # Read all sheets
        self.read_all_sheets()

        print("\n📊 Processing sheets...")
        
        # Process each sheet
        general = self.process_general_info()
        schedule = self.process_rundown()
        eco = self.process_ecologization()
        budget = self.process_budget()
        transport = self.process_transportation()
        location = self.process_location()
        volunteers = self.process_volunteers()
        games = self.process_games()
        food = self.process_food_menu()

        # Generate knowledge base
        self.generate_knowledge_base()

        print(f"\n📝 Generated {len(self.knowledge_base)} knowledge base entries")

        # Export to JSON
        print("\n💾 Exporting data...")
        self.export_to_json(OUTPUT_DIR)

        # Update chatbot knowledge
        self.update_chatbot_knowledge()

        print("\n" + "=" * 60)
        print("✅ Processing complete!")
        print("=" * 60)

        # Summary
        print(f"""
Summary:
- Processed {len(self.xl.sheet_names)} sheets
- Generated {len(self.knowledge_base)} knowledge base entries
- Output files:
  - {OUTPUT_DIR / 'knowledge_base.json'}
  - {OUTPUT_DIR / 'knowledge_base.txt'}
  - {CHATBOT_DIR / 'knowledgeBase.js'}
""")

        return {
            "general": general,
            "schedule": schedule,
            "eco": eco,
            "transport": transport,
            "location": location,
            "volunteers": volunteers,
            "games": games,
            "food": food,
            "knowledge_base": self.knowledge_base
        }


def main():
    """Main entry point."""
    if not EXCEL_FILE.exists():
        print(f"❌ Error: Excel file not found: {EXCEL_FILE}")
        return

    processor = PermiraCampDataProcessor(EXCEL_FILE)
    results = processor.process_all()

    return results


if __name__ == "__main__":
    main()
