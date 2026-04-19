def get_grade(score):
    if score >= 90:
        return "A+"
    elif score >= 80:
        return "A"
    elif score >= 70:
        return "B+"
    elif score >= 60:
        return "B"
    elif score >= 50:
        return "C"
    else:
        return "F"


def get_grade_point(score):
    if score >= 90:
        return 10
    elif score >= 80:
        return 9
    elif score >= 70:
        return 8
    elif score >= 60:
        return 7
    elif score >= 50:
        return 6
    else:
        return 0