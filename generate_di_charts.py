import os
import matplotlib.pyplot as plt

CHARTS_DIR = "/Users/aryanmaurya/MBA/CUET_PG_MBA_CHARTS"
os.makedirs(CHARTS_DIR, exist_ok=True)

def generate_tourist_pie_chart():
    labels = [
        'Tamil Nadu (22%)',
        'Maharashtra (18%)',
        'Uttar Pradesh (15%)',
        'Delhi (10%)',
        'West Bengal (5%)',
        'Rajasthan (5%)',
        'Kerala (4%)',
        'Punjab (4%)',
        'Bihar (4%)',
        'Goa (3%)',
        'Others (10%)'
    ]
    sizes = [22, 18, 15, 10, 5, 5, 4, 4, 4, 3, 10]
    colors = [
        '#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78',
        '#2ca02c', '#98df8a', '#d62728', '#ff9896',
        '#9467bd', '#c5b0d5', '#8c564b'
    ]
    explode = (0.05, 0.03, 0.03, 0, 0, 0, 0, 0, 0, 0, 0)
    
    plt.figure(figsize=(10, 8), dpi=300)
    plt.pie(
        sizes,
        explode=explode,
        labels=labels,
        colors=colors,
        autopct='%1.1f%%',
        pctdistance=0.8,
        startangle=90,
        textprops={'fontsize': 10, 'weight': 'bold'}
    )
    plt.title(
        'Percentage Share of Foreign Tourist Visits in India (2019)\nTotal Foreign Tourist Visits = 3,14,08,666 (Source: tourism.gov.in)',
        fontsize=13,
        weight='bold',
        pad=20
    )
    plt.tight_layout()
    
    out_path = os.path.join(CHARTS_DIR, "CUET_2022_DI_Foreign_Tourists_Pie_Chart.png")
    plt.savefig(out_path)
    plt.close()
    print(f"Chart saved to {out_path}")

if __name__ == "__main__":
    generate_tourist_pie_chart()
