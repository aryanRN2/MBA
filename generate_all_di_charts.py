import matplotlib.pyplot as plt
import numpy as np
import os

os.makedirs('/Users/aryanmaurya/MBA/CUET_PG_MBA_CHARTS', exist_ok=True)

# 1. 2022 Foreign Tourist Visits Pie Chart
def draw_tourist_pie_chart():
    labels = [
        'Tamil Nadu\n(22%)', 'Maharashtra\n(18%)', 'Uttar Pradesh\n(15%)',
        'Delhi\n(10%)', 'West Bengal\n(5%)', 'Rajasthan\n(5%)',
        'Kerala\n(4%)', 'Punjab\n(4%)', 'Bihar\n(4%)',
        'Goa\n(3%)', 'Others\n(10%)'
    ]
    percentages = [22, 18, 15, 10, 5, 5, 4, 4, 4, 3, 10]
    colors = [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#aec7e8'
    ]
    explode = (0.05, 0.03, 0.03, 0, 0, 0, 0, 0, 0, 0, 0)

    fig, ax = plt.subplots(figsize=(10, 8), subplot_kw=dict(aspect="equal"))
    wedges, texts, autotexts = ax.pie(
        percentages, 
        labels=labels, 
        autopct='%1.0f%%',
        startangle=90, 
        counterclock=False,
        colors=colors,
        explode=explode,
        textprops=dict(color="black", fontsize=10, weight="bold"),
        pctdistance=0.75
    )

    for autotext in autotexts:
        autotext.set_fontsize(9)
        autotext.set_color('white')
        autotext.set_weight('bold')

    ax.set_title(
        "Percentage Share of Top States in Foreign Tourist Visits (2019)\n"
        "Total Foreign Tourists = 3,14,08,666 (Source: tourism.gov.in)",
        fontsize=13, fontweight='bold', pad=20
    )

    plt.tight_layout()
    output_path = '/Users/aryanmaurya/MBA/CUET_PG_MBA_CHARTS/CUET_2022_DI_Foreign_Tourists_Pie_Chart.png'
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"Tourist Pie Chart saved to {output_path}")

# 2. 2022 Survey on First Salary Purchases Stacked Bar Chart
def draw_salary_purchase_chart():
    categories = ['Mobile Phone', 'Laptop', 'Holiday', 'Invest for Future']
    male = [35, 25, 15, 25]  # percentage distribution
    female = [20, 30, 25, 25]

    x = np.arange(len(categories))
    width = 0.5

    fig, ax = plt.subplots(figsize=(9, 6))
    p1 = ax.bar(x, male, width, label='Male (%)', color='#2b5c8f')
    p2 = ax.bar(x, female, width, bottom=male, label='Female (%)', color='#e06d53')

    ax.set_ylabel('Percentage (%)', fontsize=12, fontweight='bold')
    ax.set_title('Preferences for First Salary Expenditure by Gender', fontsize=14, fontweight='bold', pad=15)
    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontsize=11, fontweight='bold')
    ax.legend(loc='upper right', fontsize=11)
    ax.grid(axis='y', linestyle='--', alpha=0.7)

    # Add data labels
    for rect1, rect2 in zip(p1, p2):
        h1 = rect1.get_height()
        h2 = rect2.get_height()
        ax.text(rect1.get_x() + rect1.get_width()/2., h1/2., f'{int(h1)}%', ha='center', va='center', color='white', fontweight='bold')
        ax.text(rect2.get_x() + rect2.get_width()/2., h1 + h2/2., f'{int(h2)}%', ha='center', va='center', color='white', fontweight='bold')

    plt.tight_layout()
    output_path = '/Users/aryanmaurya/MBA/CUET_PG_MBA_CHARTS/CUET_2022_DI_Salary_Purchases_Bar_Chart.png'
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"Salary Purchases Bar Chart saved to {output_path}")

if __name__ == '__main__':
    draw_tourist_pie_chart()
    draw_salary_purchase_chart()
