import 'package:flutter/material.dart';

import '../app/app_strings.dart';
import '../widgets/hero_banner.dart';
import '../widgets/location_card.dart';
import '../widgets/photo_card.dart';
import '../widgets/section_title.dart';

class ReportMockupPage extends StatefulWidget {
  const ReportMockupPage({super.key});

  @override
  State<ReportMockupPage> createState() => _ReportMockupPageState();
}

class _ReportMockupPageState extends State<ReportMockupPage> {
  final TextEditingController descriptionController = TextEditingController();

  String? selectedCategory;
  bool hasPhoto = false;
  bool locationSelected = false;

  @override
  void dispose() {
    descriptionController.dispose();
    super.dispose();
  }

  void showMockupMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  void handlePhotoTap() {
    setState(() {
      hasPhoto = true;
    });
    showMockupMessage(AppStrings.photoCapturedMessage);
  }

  void handleLocationTap() {
    setState(() {
      locationSelected = !locationSelected;
    });
    showMockupMessage(AppStrings.locationSetMessage);
  }

  void handleSubmit() {
    showMockupMessage(AppStrings.submitMessage);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 28),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                AppStrings.pageTitle,
                style: theme.textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 20),
              const HeroBanner(),
              const SizedBox(height: 24),
              const SectionTitle(
                title: AppStrings.photoSectionTitle,
                subtitle: AppStrings.photoSectionSubtitle,
              ),
              const SizedBox(height: 12),
              PhotoCard(
                hasPhoto: hasPhoto,
                onTap: handlePhotoTap,
              ),
              const SizedBox(height: 24),
              const SectionTitle(
                title: AppStrings.detailsSectionTitle,
                subtitle: AppStrings.detailsSectionSubtitle,
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: selectedCategory,
                items: AppStrings.categories
                    .map(
                      (category) => DropdownMenuItem<String>(
                        value: category,
                        child: Text(category),
                      ),
                    )
                    .toList(),
                decoration: const InputDecoration(
                  labelText: AppStrings.categoryLabel,
                ),
                onChanged: (value) {
                  setState(() {
                    selectedCategory = value;
                  });
                },
              ),
              const SizedBox(height: 16),
              TextField(
                controller: descriptionController,
                minLines: 4,
                maxLines: 6,
                decoration: const InputDecoration(
                  labelText: AppStrings.descriptionLabel,
                  hintText: AppStrings.descriptionHint,
                ),
              ),
              const SizedBox(height: 24),
              const SectionTitle(
                title: AppStrings.locationSectionTitle,
                subtitle: AppStrings.locationSectionSubtitle,
              ),
              const SizedBox(height: 12),
              LocationCard(
                locationSelected: locationSelected,
                onTap: handleLocationTap,
              ),
              const SizedBox(height: 28),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: handleSubmit,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    backgroundColor: const Color(0xFFFF8A00),
                    foregroundColor: Colors.white,
                  ),
                  child: const Text(
                    AppStrings.submitButton,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              Center(
                child: Text(
                  AppStrings.footerNote,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: Colors.black45,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
